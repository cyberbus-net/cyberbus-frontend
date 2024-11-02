import { Component } from "inferno";
import { Trophy } from "@cyberbus-net/cyberbus-js-client";

interface TrophyDisplayProps {
  trophy: Trophy | null;
}

export class TrophyDisplay extends Component<TrophyDisplayProps> {
  private canvasRef: HTMLCanvasElement | null = null;
  private animationFrameId: number | null = null;

  componentDidMount() {
    this.initCanvas();
  }

  componentDidUpdate(prevProps: TrophyDisplayProps) {
    if (prevProps.trophy !== this.props.trophy) {
      this.renderTrophy();
    }
  }

  componentWillUnmount() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  initCanvas() {
    if (!this.canvasRef) return;
    const ctx = this.canvasRef.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    this.canvasRef.width = 400;
    this.canvasRef.height = 400;
  }

  renderTrophy() {
    if (!this.canvasRef || !this.props.trophy) return;
    const ctx = this.canvasRef.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);

    // Add 3D rendering logic here
    // Including shadow and glow effects
  }

  render() {
    return (
      <div className="trophy-display">
        <canvas
          ref={canvas => (this.canvasRef = canvas)}
          className="trophy-canvas"
        />
      </div>
    );
  }
}
