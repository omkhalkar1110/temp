import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onFallback?: (error: Error) => void;
  fallbackComponent?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MapErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[MapErrorBoundary] Caught map rendering error, triggering graceful fallback:', error, errorInfo);
    if (this.props.onFallback) {
      this.props.onFallback(error);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      return (
        <div className="w-full h-full min-h-[350px] flex flex-col items-center justify-center bg-white/95 text-stone-900 p-6 rounded-2xl border border-stone-200 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-1">
            {this.props.fallbackTitle || 'Map Engine Switched to Fallback'}
          </h3>
          <p className="text-xs text-stone-500 max-w-md mb-4 font-mono">
            {this.state.error?.message || 'The primary map engine encountered an issue. OpenGIS Leaflet has taken over seamlessly.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Engine</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
