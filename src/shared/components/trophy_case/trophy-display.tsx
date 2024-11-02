import { Component } from "inferno";
import { Trophy } from "@cyberbus-net/cyberbus-js-client";
import * as THREE from "three";

interface TrophyDisplayProps {
  trophy: Trophy | null;
}

interface TrophyDisplayState {
  fps: number;
}

export class TrophyDisplay extends Component<
  TrophyDisplayProps,
  TrophyDisplayState
> {
  private container: HTMLDivElement | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private badge3D: THREE.Group | null = null;
  private animationFrameId: number | null = null;

  state = {
    fps: 0,
  };

  componentDidMount() {
    this.initThreeJS();
    this.animate();
  }

  componentWillUnmount() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer && this.container) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }

  async componentDidUpdate(prevProps: TrophyDisplayProps) {
    console.log("Scene status:", {
      hasScene: !!this.scene,
      hasCamera: !!this.camera,
      hasRenderer: !!this.renderer,
      containerSize: this.container
        ? {
            width: this.container.clientWidth,
            height: this.container.clientHeight,
          }
        : null,
    });

    if (prevProps.trophy !== this.props.trophy && this.props.trophy?.badgeSvg) {
      try {
        if (this.scene && this.badge3D) {
          this.scene.remove(this.badge3D);
        }
        this.badge3D = await this.createBadge3D(this.props.trophy.badgeSvg);
        console.log("New badge3D created:", this.badge3D);

        if (this.scene && this.badge3D) {
          this.scene.add(this.badge3D);
          // 调整徽章位置和大小
          this.badge3D.position.set(0, 0, 0);
          this.badge3D.scale.set(0.05, 0.05, 0.05);
          // 开始动画
          if (!this.animationFrameId) {
            this.animate();
          }
        }
      } catch (error) {
        console.error("Error creating badge:", error);
      }
    }
  }

  private initThreeJS() {
    if (!this.container) return;

    // 初始化场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f9fa); // 设置背景色

    // 设置相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 5;

    // 设置渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );
    this.container.appendChild(this.renderer.domElement);

    // 添加环境光和平行光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    this.scene.add(ambientLight, directionalLight);
  }

  private async createBadge3D(svgData: string) {
    const { SVGLoader } = await import(
      "three/examples/jsm/loaders/SVGLoader.js"
    );
    const loader = new SVGLoader();
    const svgPaths = loader.parse(svgData).paths;

    const group = new THREE.Group();
    const material = new THREE.MeshPhongMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2,
    });

    // Create extruded geometry from SVG paths
    svgPaths.forEach(path => {
      const shapes = path.toShapes(true);
      shapes.forEach(shape => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 0.2,
          bevelEnabled: true,
          bevelThickness: 0.05,
          bevelSize: 0.05,
          bevelSegments: 3,
        });
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
      });
    });

    return group;
  }

  private animate = () => {
    if (!this.scene || !this.camera || !this.renderer || !this.badge3D) return;

    // 旋转徽章
    if (this.badge3D) {
      this.badge3D.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  render() {
    return (
      <div
        ref={ref => (this.container = ref)}
        style={{
          width: "100%",
          height: "300px",
          border: "1px solid #ddd", // 添加边框以便于调试
          backgroundColor: "#f8f9fa",
        }}
      />
    );
  }
}
