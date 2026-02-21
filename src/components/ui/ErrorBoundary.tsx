"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(err: unknown): State {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return { hasError: true, message };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">!</span>
              </div>
              <h2 className="text-white font-bold text-xl mb-2">App Error</h2>
              <p className="text-white/50 text-sm mb-4">{this.state.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-abobi-purple text-white text-sm rounded-xl hover:bg-abobi-glow transition-colors"
              >
                Reload
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
