import { Component } from "inferno";
import { Trophy } from "@cyberbus-net/cyberbus-js-client";
import * as THREE from "three";

interface TrophyDisplayProps {
  trophy: Trophy | null;
}

interface TrophyDisplayState {
  fps: number;
  isAutoRotating: boolean;
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
  private controls: OrbitControls | null = null;

  state = {
    fps: 0,
    isAutoRotating: true,
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
    if (this.controls) {
      this.controls.dispose();
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
          // 将缩放比例从 0.03 增加到 0.12
          this.badge3D.scale.set(0.06, 0.06, 0.06);
          this.badge3D.position.set(0, 0, 0);
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

  private async initThreeJS() {
    if (!this.container) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f9fa);

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.set(0, 0, 10);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );
    this.container.appendChild(this.renderer.domElement);

    // 动态导入并设置 OrbitControls
    const { OrbitControls } = await import(
      "three/examples/jsm/controls/OrbitControls"
    );
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;

    this.controls.addEventListener("start", () => {
      this.setState({ isAutoRotating: false });
    });

    this.controls.addEventListener("end", () => {
      this.setState({ isAutoRotating: true });
    });

    // 增强光照系统
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);

    // 主要方向光
    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
    mainLight.position.set(5, 5, 5);

    // 填充光（从反方向照射）
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-5, -2, -5);

    // 顶部点光源
    const topLight = new THREE.PointLight(0xffffff, 1.0, 10);
    topLight.position.set(0, 5, 0);

    // 前方点光源
    const frontLight = new THREE.PointLight(0xffffff, 1.0, 10);
    frontLight.position.set(0, 0, 5);

    // 添加所有光源
    this.scene.add(ambientLight);
    this.scene.add(mainLight);
    this.scene.add(fillLight);
    this.scene.add(topLight);
    this.scene.add(frontLight);

    // 可选：添加光源辅助器（调试用）
    // this.scene.add(new THREE.DirectionalLightHelper(mainLight));
    // this.scene.add(new THREE.DirectionalLightHelper(fillLight));
    // this.scene.add(new THREE.PointLightHelper(topLight));
    // this.scene.add(new THREE.PointLightHelper(frontLight));
  }

  private async createBadge3D(svgString: string) {
    const { SVGLoader } = await import("three/examples/jsm/loaders/SVGLoader");
    const loader = new SVGLoader();
    const svgData = loader.parse(svgString);
    const group = new THREE.Group();

    // 计算SVG的边界框
    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;

    svgData.paths.forEach(path => {
      const points = path.subPaths.flatMap(subPath => subPath.getPoints());
      points.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const HEIGHT_INCREMENT = -5;
    const totalPaths = svgData.paths.length;

    svgData.paths.forEach((path, pathIndex) => {
      const fillColor = path.userData?.style.fill;
      const shapes = path.toShapes(true);

      shapes.forEach(shape => {
        // 创建一个新的变换矩阵
        const matrix = new THREE.Matrix4();
        matrix.makeScale(-1, -1, 1); // 水平和垂直翻转

        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 2,
          bevelEnabled: true,
          bevelThickness: 0.2,
          bevelSize: 0.1,
          bevelSegments: 10,
          curveSegments: 12,
        });

        // 应用变换
        geometry.applyMatrix4(matrix);

        // 将几何体移动到中心
        geometry.translate(-centerX, -centerY, 0);

        const offsetIndex = totalPaths - 1 - pathIndex;

        const frontMaterial = new THREE.MeshStandardMaterial({
          color: fillColor || 0xffffff,
          metalness: 0.3,
          roughness: 0.7,
          side: THREE.FrontSide,
          polygonOffset: true,
          polygonOffsetFactor: offsetIndex,
          polygonOffsetUnits: 1,
        });

        const backMaterial = new THREE.MeshStandardMaterial({
          color: fillColor || 0xffffff,
          metalness: 0.3,
          roughness: 0.7,
          side: THREE.BackSide,
          polygonOffset: true,
          polygonOffsetFactor: offsetIndex,
          polygonOffsetUnits: 1,
        });

        const mesh = new THREE.Mesh(geometry, [frontMaterial, backMaterial]);
        mesh.position.z = offsetIndex * HEIGHT_INCREMENT;

        group.add(mesh);
      });
    });

    // 计算整体边界框
    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // 更新所有子网格的几何体顶点位置
    group.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        const geometry = child.geometry;
        geometry.translate(-center.x, -center.y, -center.z);
      }
    });

    // 重置组的位置（因为我们已经移动了几何体）
    group.position.set(0, 0, 0);

    // 添加边界框辅助器（用于调试）
    const boxAfterCentering = new THREE.Box3().setFromObject(group);
    const boxHelper = new THREE.Box3Helper(boxAfterCentering, 0xff0000);
    group.add(boxHelper);

    // 添加坐标轴辅助器（用于调试）
    const axesHelper = new THREE.AxesHelper(5);
    group.add(axesHelper);

    // 输出调试信息
    const size = new THREE.Vector3();
    boxAfterCentering.getSize(size);
    const finalCenter = new THREE.Vector3();
    boxAfterCentering.getCenter(finalCenter);
    console.log("Box dimensions after centering:", {
      size: size,
      center: finalCenter,
      min: boxAfterCentering.min,
      max: boxAfterCentering.max,
    });

    return group;
  }

  private animate = () => {
    if (
      !this.scene ||
      !this.camera ||
      !this.renderer ||
      !this.badge3D ||
      !this.controls
    )
      return;

    // 只在没有用户交互时自动旋转
    if (this.state.isAutoRotating && this.badge3D) {
      this.badge3D.rotation.y += 0.01;
    }

    this.controls.update(); // 更新控制器
    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  render() {
    return (
      <div
        ref={ref => (this.container = ref)}
        style={{
          width: "100%",
          height: "600px",
          border: "1px solid #ddd", // 添加边框以便于调试
          backgroundColor: "#f8f9fa",
        }}
      />
    );
  }
}
