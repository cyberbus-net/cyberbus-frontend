import { Component } from "inferno";
import { Trophy } from "@cyberbus-net/cyberbus-js-client";
import * as THREE from "three";
import { getBadgeDescription, formatDate } from "./trophy-utils";
import { I18NextService } from "../../services";

interface TrophyDisplayProps {
  trophy: Trophy | null;
  debug?: boolean;
}

interface TrophyDisplayState {
  fps: number;
  isAutoRotating: boolean;
  isExploded: boolean;
  explosionProgress: number;
  rotationCenter: THREE.Vector3;
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
  private readonly INITIAL_Z_OFFSET = -0.04;
  private readonly EXPLODED_Z_OFFSET = -5;
  private explosionAnimationId: number | null = null;

  state = {
    fps: 0,
    isAutoRotating: true,
    isExploded: false,
    explosionProgress: 0,
    rotationCenter: new THREE.Vector3(0, 0, 0),
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
    if (this.explosionAnimationId) {
      cancelAnimationFrame(this.explosionAnimationId);
    }
  }

  async componentDidUpdate(
    prevProps: TrophyDisplayProps,
    prevState: TrophyDisplayState,
  ) {
    if (prevProps.trophy !== this.props.trophy && this.props.trophy?.badgeSvg) {
      try {
        if (this.scene && this.badge3D) {
          this.scene.remove(this.badge3D);
        }
        this.badge3D = await this.createBadge3D(this.props.trophy.badgeSvg);

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

    if (
      prevState.explosionProgress !== this.state.explosionProgress &&
      this.badge3D
    ) {
      const increments = this.getCurrentIncrements();
      this.badge3D.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          const offsetIndex = this.badge3D!.children.length - 1 - index;
          child.position.setZ(offsetIndex * increments.height);
        }
      });
    }
  }

  private async initThreeJS() {
    if (!this.container) return;

    this.scene = new THREE.Scene();

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

    // 顶部点光源
    const topLight = new THREE.PointLight(0xffffff, 1.0, 10);
    topLight.position.set(0, 5, 0);

    // 前方点光源
    const frontLight = new THREE.PointLight(0xffffff, 1.0, 10);
    frontLight.position.set(0, 0, 5);

    // 添加所有光源
    this.scene.add(ambientLight);
    this.scene.add(mainLight);
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

    const HEIGHT_INCREMENT = -0.04;
    const X_INCREMENT = -0.04;
    const Y_INCREMENT = -0.04;
    const totalPaths = svgData.paths.length;

    svgData.paths.forEach((path, pathIndex) => {
      const fillColor = path.userData?.style.fill;
      const shapes = path.toShapes(true);

      shapes.forEach(shape => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 2,
          bevelEnabled: true,
          bevelThickness: 0.2,
          bevelSize: 0.1,
          bevelSegments: 10,
          curveSegments: 12,
        });

        geometry.translate(-centerX, -centerY, 0);

        const offsetIndex = totalPaths - 1 - pathIndex;

        const material = new THREE.MeshStandardMaterial({
          color: fillColor || 0xffffff,
          metalness: 0.3,
          roughness: 0.7,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: offsetIndex,
          polygonOffsetUnits: 1,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI;
        mesh.position.set(
          offsetIndex * X_INCREMENT,
          offsetIndex * Y_INCREMENT,
          offsetIndex *
            (this.state.isExploded ? this.EXPLODED_Z_OFFSET : HEIGHT_INCREMENT),
        );

        group.add(mesh);
      });
    });

    // 计算整体边界框和居中处理
    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    box.getCenter(center);

    group.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        const geometry = child.geometry;
        geometry.translate(-center.x, -center.y, -center.z);
      }
    });

    group.position.set(0, 0, 0);

    // 只在 debug 模式下添加辅助器
    if (this.props.debug) {
      // 添加边界框辅助器
      const boxAfterCentering = new THREE.Box3().setFromObject(group);
      const boxHelper = new THREE.Box3Helper(boxAfterCentering, 0xff0000);
      group.add(boxHelper);

      // 添加坐标轴辅助器
      const axesHelper = new THREE.AxesHelper(5);
      group.add(axesHelper);

      // 输出调试信息
      const size = new THREE.Vector3();
      boxAfterCentering.getSize(size);
      const finalCenter = new THREE.Vector3();
      boxAfterCentering.getCenter(finalCenter);
    }

    return group;
  }

  private updateRotationCenter() {
    if (!this.badge3D) return;

    // 计算当前模型的边界框
    const box = new THREE.Box3().setFromObject(this.badge3D);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // 更新旋转中心
    this.setState({ rotationCenter: center });
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

    // 将模型移动到原点
    this.badge3D.position.sub(this.state.rotationCenter);

    // 应用旋转
    this.badge3D.rotation.y += 0.005;

    // 恢复原始位置
    this.badge3D.position.add(this.state.rotationCenter);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private handleDoubleClick = () => {
    this.setState(
      prevState => ({
        isExploded: !prevState.isExploded,
        explosionProgress: prevState.isExploded ? 1 : 0,
      }),
      () => {
        if (this.explosionAnimationId) {
          cancelAnimationFrame(this.explosionAnimationId);
        }
        this.animateExplosion();
      },
    );
  };

  private animateExplosion = () => {
    const { isExploded, explosionProgress } = this.state;
    const targetProgress = isExploded ? 1 : 0;
    const speed = isExploded ? 0.03 : 0.05;

    let newProgress = explosionProgress;
    if (isExploded) {
      newProgress = Math.min(1, explosionProgress + speed);
    } else {
      newProgress = Math.max(0, explosionProgress - speed);
    }

    this.setState({ explosionProgress: newProgress }, () => {
      // 在每次爆炸动画更新后重新计算旋转中心
      this.updateRotationCenter();

      if (newProgress !== targetProgress) {
        this.explosionAnimationId = requestAnimationFrame(
          this.animateExplosion,
        );
      }
    });
  };

  private getCurrentIncrements() {
    const { explosionProgress } = this.state;
    const currentZ =
      this.INITIAL_Z_OFFSET +
      (this.EXPLODED_Z_OFFSET - this.INITIAL_Z_OFFSET) * explosionProgress;
    return { x: 0, y: 0, height: currentZ };
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space" || event.code === "Enter") {
      this.handleDoubleClick();
    }
  };

  render() {
    const description = this.props.trophy
      ? I18NextService.i18n.t(getBadgeDescription(this.props.trophy.name))
      : "";

    return (
      <div style={{ width: "100%" }}>
        <div
          ref={ref => (this.container = ref)}
          onClick={this.handleDoubleClick}
          onKeyDown={this.handleKeyDown}
          role="button"
          tabIndex={0}
          style={{
            width: "100%",
            height: "500px",
            cursor: "pointer",
          }}
          aria-label="3D Trophy Display"
        />
        {description && (
          <div className="trophy-display-content">{description}</div>
        )}
        {this.props.trophy && (
          <div className="trophy-display-content">
            {`${I18NextService.i18n.t("rewarded_at")}: ${formatDate(this.props.trophy.rewarded_at)}`}
          </div>
        )}
      </div>
    );
  }
}
