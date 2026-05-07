// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title  CaseAgentNFT (ERC-7857 INFT)
 * @notice Tokenized AI agents that own a user's immigration case on 0G.
 *         Each token represents a personal Case Agent: encrypted memory blob
 *         (persona + chat history + cases) lives on 0G Storage, and the chain
 *         holds the hash commitment + sealed key pointer.
 *
 *         Implements the spirit of ERC-7857 (Intelligent NFT) with the three
 *         core operations: mint (sealed), transfer (oracle re-encryption),
 *         clone (forked agent), and authorizeUsage (delegated execution
 *         without transfer of ownership).
 *
 * @dev    The oracle is a trusted address that signs re-encryption proofs.
 *         For mainnet hardening, this should be replaced with a ZK or TEE
 *         attestation verifier. The current design keeps the surface stable
 *         so the verification mechanism can be swapped without changing the
 *         token contract.
 *
 *         Deployed on 0G Aristotle Mainnet (chainId 16661).
 */
contract CaseAgentNFT {

    // ─── ERC-721 minimal interface ────────────────────────────────────────────

    string  public constant name   = "ZeroViza Case Agent";
    string  public constant symbol = "ZVCA";

    address public owner;
    address public operator;
    address public oracle;

    uint256 public nextId;
    mapping(uint256 => address) private _ownerOf;
    mapping(address => uint256) private _balanceOf;
    mapping(uint256 => address) private _approvals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // ─── INFT-specific state ──────────────────────────────────────────────────

    /// @notice Hash of the encrypted metadata blob (binds the chain commitment to the off-chain data).
    mapping(uint256 => bytes32) public contentHash;

    /// @notice 0G Storage rootHash holding the encrypted metadata blob.
    mapping(uint256 => string)  public metadataURI;

    /// @notice Sealed symmetric key: encrypted to the current owner's public key. Off-chain encrypts/decrypts.
    mapping(uint256 => bytes)   public sealedKey;

    /// @notice authorizeUsage: tokenId => executor => permission expiry timestamp (0 = revoked).
    mapping(uint256 => mapping(address => uint256)) public authorizedUntil;

    // ─── Events ───────────────────────────────────────────────────────────────

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed _owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool approved);

    event AgentMinted(
        uint256 indexed tokenId,
        address indexed to,
        string  metadataURI,
        bytes32 contentHash
    );

    event AgentTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        bytes32 newContentHash
    );

    event AgentCloned(
        uint256 indexed sourceTokenId,
        uint256 indexed newTokenId,
        address indexed to,
        bytes32 newContentHash
    );

    event UsageAuthorized(
        uint256 indexed tokenId,
        address indexed executor,
        uint256 expiresAt,
        bytes32 permissionsHash
    );

    event MetadataUpdated(uint256 indexed tokenId, string newURI, bytes32 newContentHash);

    event OracleUpdated(address indexed newOracle);
    event OperatorUpdated(address indexed newOperator);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ─── Errors ───────────────────────────────────────────────────────────────

    error Unauthorized();
    error ZeroAddress();
    error TokenDoesNotExist();
    error InvalidProof();
    error NotOwnerNorApproved();

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyAuthorized() {
        if (msg.sender != owner && msg.sender != operator) revert Unauthorized();
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(address _operator, address _oracle) {
        if (_operator == address(0) || _oracle == address(0)) revert ZeroAddress();
        owner    = msg.sender;
        operator = _operator;
        oracle   = _oracle;
        emit OwnershipTransferred(address(0), msg.sender);
        emit OperatorUpdated(_operator);
        emit OracleUpdated(_oracle);
    }

    // ─── Mint ────────────────────────────────────────────────────────────────

    /**
     * @notice Mint a new Case Agent INFT to `to`.
     * @param  to              Recipient (the user owning the agent).
     * @param  uri             0G Storage rootHash of the encrypted metadata blob.
     * @param  hash_           Content hash binding the chain commitment to the blob.
     * @param  initialSealedKey Sealed symmetric key encrypted to `to`'s public key.
     * @return tokenId         Newly minted token id.
     *
     * @dev    Operator (server wallet) typically calls this on behalf of the user
     *         right after the user's first interaction. Owner can also mint directly.
     */
    function mint(
        address to,
        string calldata uri,
        bytes32 hash_,
        bytes calldata initialSealedKey
    ) external onlyAuthorized returns (uint256 tokenId) {
        if (to == address(0)) revert ZeroAddress();

        unchecked { tokenId = ++nextId; }
        _ownerOf[tokenId] = to;
        _balanceOf[to]   += 1;

        metadataURI[tokenId] = uri;
        contentHash[tokenId] = hash_;
        sealedKey[tokenId]   = initialSealedKey;

        emit Transfer(address(0), to, tokenId);
        emit AgentMinted(tokenId, to, uri, hash_);
    }

    // ─── INFT transfer with oracle re-encryption ─────────────────────────────

    /**
     * @notice Transfer an agent to a new owner. Off-chain, the oracle has
     *         re-encrypted the metadata blob with the recipient's public key
     *         and produced a fresh sealedKey. The oracle's signature over
     *         (tokenId, newURI, newContentHash, newSealedKey, to) is verified.
     */
    function transferAgent(
        address to,
        uint256 tokenId,
        string calldata newURI,
        bytes32 newContentHash,
        bytes calldata newSealedKey,
        bytes calldata oracleSig
    ) external {
        address from = _ownerOf[tokenId];
        if (from == address(0)) revert TokenDoesNotExist();
        if (msg.sender != from && msg.sender != _approvals[tokenId] && !_operatorApprovals[from][msg.sender]) {
            revert NotOwnerNorApproved();
        }
        if (to == address(0)) revert ZeroAddress();

        bytes32 digest = keccak256(
            abi.encodePacked("ZV-INFT-TRANSFER", tokenId, to, newURI, newContentHash, newSealedKey)
        );
        if (!_verifyOracle(digest, oracleSig)) revert InvalidProof();

        // Clear approvals
        _approvals[tokenId] = address(0);

        // Update ownership
        _balanceOf[from] -= 1;
        _balanceOf[to]   += 1;
        _ownerOf[tokenId] = to;

        // Update sealed metadata pointers
        metadataURI[tokenId] = newURI;
        contentHash[tokenId] = newContentHash;
        sealedKey[tokenId]   = newSealedKey;

        emit Transfer(from, to, tokenId);
        emit AgentTransferred(tokenId, from, to, newContentHash);
    }

    // ─── INFT clone (fork an agent) ──────────────────────────────────────────

    /**
     * @notice Clone an agent's state into a new INFT for `to`. Use when a
     *         user wants to spin off a sub-agent for a specific case while
     *         keeping the original. Oracle signs over the new sealed payload.
     */
    function cloneAgent(
        address to,
        uint256 sourceTokenId,
        string calldata newURI,
        bytes32 newContentHash,
        bytes calldata newSealedKey,
        bytes calldata oracleSig
    ) external returns (uint256 newTokenId) {
        address sourceOwner = _ownerOf[sourceTokenId];
        if (sourceOwner == address(0)) revert TokenDoesNotExist();
        if (msg.sender != sourceOwner && !_operatorApprovals[sourceOwner][msg.sender]) {
            revert NotOwnerNorApproved();
        }
        if (to == address(0)) revert ZeroAddress();

        bytes32 digest = keccak256(
            abi.encodePacked("ZV-INFT-CLONE", sourceTokenId, to, newURI, newContentHash, newSealedKey)
        );
        if (!_verifyOracle(digest, oracleSig)) revert InvalidProof();

        unchecked { newTokenId = ++nextId; }
        _ownerOf[newTokenId] = to;
        _balanceOf[to]      += 1;

        metadataURI[newTokenId] = newURI;
        contentHash[newTokenId] = newContentHash;
        sealedKey[newTokenId]   = newSealedKey;

        emit Transfer(address(0), to, newTokenId);
        emit AgentCloned(sourceTokenId, newTokenId, to, newContentHash);
    }

    // ─── Delegated usage without transfer ────────────────────────────────────

    /**
     * @notice Authorize an executor (e.g. a verified lawyer agent) to use this
     *         agent's capabilities until `expiresAt`. permissionsHash binds to
     *         an off-chain JSON describing what the executor may do.
     */
    function authorizeUsage(
        uint256 tokenId,
        address executor,
        uint256 expiresAt,
        bytes32 permissionsHash
    ) external {
        address tokenOwner = _ownerOf[tokenId];
        if (tokenOwner == address(0)) revert TokenDoesNotExist();
        if (msg.sender != tokenOwner && !_operatorApprovals[tokenOwner][msg.sender]) {
            revert NotOwnerNorApproved();
        }
        if (executor == address(0)) revert ZeroAddress();

        authorizedUntil[tokenId][executor] = expiresAt;
        emit UsageAuthorized(tokenId, executor, expiresAt, permissionsHash);
    }

    // ─── Owner-driven metadata refresh (no ownership change) ─────────────────

    /**
     * @notice Update the agent's encrypted memory pointer when the user has
     *         new conversations or case events. Only the token owner (or an
     *         operator they approved) may call this.
     */
    function updateMetadata(
        uint256 tokenId,
        string calldata newURI,
        bytes32 newContentHash
    ) external {
        address tokenOwner = _ownerOf[tokenId];
        if (tokenOwner == address(0)) revert TokenDoesNotExist();
        if (msg.sender != tokenOwner && !_operatorApprovals[tokenOwner][msg.sender]) {
            revert NotOwnerNorApproved();
        }

        metadataURI[tokenId] = newURI;
        contentHash[tokenId] = newContentHash;
        emit MetadataUpdated(tokenId, newURI, newContentHash);
    }

    // ─── ERC-721 read views ──────────────────────────────────────────────────

    function ownerOf(uint256 tokenId) external view returns (address) {
        address o = _ownerOf[tokenId];
        if (o == address(0)) revert TokenDoesNotExist();
        return o;
    }

    function balanceOf(address account) external view returns (uint256) {
        if (account == address(0)) revert ZeroAddress();
        return _balanceOf[account];
    }

    function getApproved(uint256 tokenId) external view returns (address) {
        if (_ownerOf[tokenId] == address(0)) revert TokenDoesNotExist();
        return _approvals[tokenId];
    }

    function isApprovedForAll(address account, address op) external view returns (bool) {
        return _operatorApprovals[account][op];
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        if (_ownerOf[tokenId] == address(0)) revert TokenDoesNotExist();
        return metadataURI[tokenId];
    }

    /// @notice ERC-7857 view: returns the bound sealed-key payload.
    function sealedKeyOf(uint256 tokenId) external view returns (bytes memory) {
        if (_ownerOf[tokenId] == address(0)) revert TokenDoesNotExist();
        return sealedKey[tokenId];
    }

    /// @notice Whether `executor` may currently act on `tokenId`'s behalf.
    function isExecutorAuthorized(uint256 tokenId, address executor) external view returns (bool) {
        return authorizedUntil[tokenId][executor] >= block.timestamp;
    }

    // ─── Approvals (standard ERC-721) ────────────────────────────────────────

    function approve(address to, uint256 tokenId) external {
        address tokenOwner = _ownerOf[tokenId];
        if (tokenOwner == address(0)) revert TokenDoesNotExist();
        if (msg.sender != tokenOwner && !_operatorApprovals[tokenOwner][msg.sender]) {
            revert NotOwnerNorApproved();
        }
        _approvals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function setApprovalForAll(address op, bool approved) external {
        _operatorApprovals[msg.sender][op] = approved;
        emit ApprovalForAll(msg.sender, op, approved);
    }

    // ─── Admin ──────────────────────────────────────────────────────────────

    function setOracle(address newOracle) external onlyOwner {
        if (newOracle == address(0)) revert ZeroAddress();
        oracle = newOracle;
        emit OracleUpdated(newOracle);
    }

    function setOperator(address newOperator) external onlyOwner {
        if (newOperator == address(0)) revert ZeroAddress();
        operator = newOperator;
        emit OperatorUpdated(newOperator);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ─── Internal: oracle signature verification ─────────────────────────────

    function _verifyOracle(bytes32 digest, bytes calldata sig) internal view returns (bool) {
        if (sig.length != 65) return false;
        bytes32 r;
        bytes32 s;
        uint8   v;
        assembly {
            r := calldataload(sig.offset)
            s := calldataload(add(sig.offset, 32))
            v := byte(0, calldataload(add(sig.offset, 64)))
        }
        if (v < 27) v += 27;
        bytes32 ethDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", digest));
        address recovered = ecrecover(ethDigest, v, r, s);
        return recovered != address(0) && recovered == oracle;
    }
}
