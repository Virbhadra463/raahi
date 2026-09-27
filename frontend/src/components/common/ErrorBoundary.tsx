import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }



  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#FAF5EE] rounded-3xl p-8 border-2 border-[#E8DAC9] text-[#1C1440] shadow-sm my-6 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-[#7A1026] mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-black text-xl text-[#1C1440]">
            {this.props.fallbackTitle || "Something went wrong displaying this section"}
          </h3>
          <p className="text-xs text-[#1C1440]/70">
            {this.state.error?.message || "An unexpected error occurred. You can safely reload or re-plan."}
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7A1026] hover:bg-[#9C1A35] text-[#FFD38A] text-xs font-bold font-mono tracking-wider transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RETRY &amp; RELOAD</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
