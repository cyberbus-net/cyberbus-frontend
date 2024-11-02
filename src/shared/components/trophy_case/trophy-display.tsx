import { Component } from "inferno";
import { Trophy } from "@cyberbus-net/cyberbus-js-client";
import { getBadgeIcon } from "./trophy-utils";

interface TrophyDisplayProps {
  trophy: Trophy | null;
}

export class TrophyDisplay extends Component<TrophyDisplayProps> {
  private canvasRef: HTMLCanvasElement | null = null;
  private animationFrameId: number | null = null;
  private isDragging = false;
  private lastMouseX = 0;
  private rotationAngle = 0;
  private badgeTexture: HTMLImageElement | null = null;

  componentDidMount() {
    this.initCanvas();
    this.setupMouseEvents();
    if (this.props.trophy) {
      const badgeIcon = getBadgeIcon(this.props.trophy.name);
      this.createBadgeTexture(badgeIcon).then(texture => {
        this.badgeTexture = texture;
        this.renderTrophy();
      });
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

  setupMouseEvents() {
    if (!this.canvasRef) return;

    this.canvasRef.addEventListener("mousedown", e => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
    });

    document.addEventListener("mousemove", e => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.lastMouseX;
      this.rotationAngle += deltaX * 0.01;
      this.lastMouseX = e.clientX;
    });

    document.addEventListener("mouseup", () => {
      this.isDragging = false;
    });
  }

  componentDidUpdate(prevProps: TrophyDisplayProps) {
    if (prevProps.trophy !== this.props.trophy && this.props.trophy) {
      const badgeIcon = getBadgeIcon(this.props.trophy.name);
      this.createBadgeTexture(badgeIcon).then(texture => {
        this.badgeTexture = texture;
        this.renderTrophy();
      });
    }
  }

  componentWillUnmount() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  async createBadgeTexture(badgeIcon: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const img = new Image();
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <foreignObject width="100" height="100">
          <div xmlns="http://www.w3.org/1999/xhtml">${badgeIcon}</div>
        </foreignObject>
      </svg>`;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      img.src = URL.createObjectURL(blob);
      img.onload = () => resolve(img);
    });
  }

  renderTrophy = () => {
    if (!this.canvasRef || !this.badgeTexture) return;
    const ctx = this.canvasRef.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);

    ctx.save();
    ctx.translate(this.canvasRef.width / 2, this.canvasRef.height / 2);

    const badgeWidth = 100;
    const badgeHeight = 100;
    const depth = 5;

    // Apply perspective scaling
    const scaleX = Math.abs(Math.cos(this.rotationAngle));
    ctx.scale(scaleX, 1);

    // Add shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    // Draw both sides with the badge texture
    if (Math.cos(this.rotationAngle) > 0) {
      // Front face
      ctx.drawImage(
        this.badgeTexture,
        -badgeWidth / 2,
        -badgeHeight / 2,
        badgeWidth,
        badgeHeight,
      );
    } else {
      // Back face - mirror the image
      ctx.scale(-1, 1); // Flip horizontally
      ctx.drawImage(
        this.badgeTexture,
        -badgeWidth / 2,
        -badgeHeight / 2,
        badgeWidth,
        badgeHeight,
      );
    }

    // Add shine effect (applies to both sides)
    const gradient = ctx.createLinearGradient(
      -badgeWidth / 2,
      -badgeHeight / 2,
      badgeWidth / 2,
      badgeHeight / 2,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");
    ctx.fillStyle = gradient;
    ctx.fillRect(-badgeWidth / 2, -badgeHeight / 2, badgeWidth, badgeHeight);

    // Draw edge
    const edgeWidth = depth * Math.abs(Math.sin(this.rotationAngle));
    if (edgeWidth > 0.5) {
      ctx.fillStyle = "#ddd";
      if (Math.sin(this.rotationAngle) > 0) {
        ctx.fillRect(badgeWidth / 2, -badgeHeight / 2, edgeWidth, badgeHeight);
      } else {
        ctx.fillRect(
          -badgeWidth / 2 - edgeWidth,
          -badgeHeight / 2,
          edgeWidth,
          badgeHeight,
        );
      }
    }

    ctx.restore();

    // Continue animation
    this.animationFrameId = requestAnimationFrame(this.renderTrophy);
  };

  render() {
    return (
      <div className="trophy-display">
        <canvas
          ref={canvas => (this.canvasRef = canvas)}
          className="trophy-canvas"
          style={{ width: "400px", height: "400px" }}
        />
      </div>
    );
  }
}
