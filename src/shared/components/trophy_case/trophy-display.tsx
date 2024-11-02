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

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f9fa);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );
    this.container.appendChild(this.renderer.domElement);

    // 增强光照效果
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);

    directionalLight1.position.set(1, 1, 1);
    directionalLight2.position.set(-1, -1, -1);

    this.scene.add(ambientLight, directionalLight1, directionalLight2);
  }

  private async createBadge3D(svgString: string) {
    // 动态导入 SVGLoader
    const { SVGLoader } = await import("three/examples/jsm/loaders/SVGLoader");

    // 创建SVG加载器
    const loader = new SVGLoader();
    const svgData = loader.parse(svgString);
    const group = new THREE.Group();

    // 遍历SVG中的所有路径
    svgData.paths.forEach(path => {
      // 获取SVG中的样式
      const fillColor = path.userData?.style.fill;
      const strokeColor = path.userData?.style.stroke;

      // 为每个路径创建形状
      const shapes = path.toShapes(true);
      shapes.forEach(shape => {
        // 创建拉伸几何体
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 2,
          bevelEnabled: true,
          bevelThickness: 0.2,
          bevelSize: 0.1,
          bevelSegments: 3,
        });

        // 创建材质，使用SVG中定义的颜色
        const material = new THREE.MeshPhongMaterial({
          color: fillColor || 0xffffff,
          emissive: 0x000000,
          specular: 0x111111,
          shininess: 30,
          side: THREE.DoubleSide,
          flatShading: true,
        });

        // 如果有描边，添加描边材质
        if (strokeColor) {
          const strokeMaterial = new THREE.LineBasicMaterial({
            color: strokeColor,
          });
          const edges = new THREE.EdgesGeometry(geometry);
          const line = new THREE.LineSegments(edges, strokeMaterial);
          group.add(line);
        }

        // 创建网格并添加到组中
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
      });
    });

    // 居中模型
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);

    // 调整模型方向
    group.scale.y *= -1;

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
