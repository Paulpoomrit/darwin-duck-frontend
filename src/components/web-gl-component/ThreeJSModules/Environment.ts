import { DirectionalLight, Scene } from 'three';
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// import grassShader from '../shaders/grass.js';
import grassVertShader from '../shaders/glsl/grass.vert.glsl?raw';
import grassFragShader from '../shaders/glsl/grass.frag.glsl?raw';

export default class Environment {
    scene: Scene;
    light: DirectionalLight;
    PLANE_SIZE: number;
    BLADE_COUNT: number;
    BLADE_WIDTH: number;
    BLADE_HEIGHT: number;
    BLADE_HEIGHT_VARIATION: number;
    grassMaterial?: THREE.ShaderMaterial;
    startTime?: number;
    grassUniforms?: {
        textures: {
            value: THREE.Texture[];
        };
        iTime: {
            type: string;
            value: number;
        };
    };

    constructor(scene: Scene) {
        this.scene = scene;
        this.PLANE_SIZE = 25;
        this.BLADE_COUNT = 300000;
        this.BLADE_WIDTH = 0.1;
        this.BLADE_HEIGHT = 0.5;
        this.BLADE_HEIGHT_VARIATION = 0.2;

        const hdr = 'autumn_field_puresky_4k.hdr';

        let environmentTexture: THREE.DataTexture;

        // hdr env
        new RGBELoader().load(hdr, (texture) => {
            environmentTexture = texture;
            environmentTexture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = environmentTexture;
            this.scene.background = environmentTexture;
            this.scene.environmentIntensity = 0.5; // added in Three r163
        });

        // Add a dirt plane
        const geometry = new THREE.PlaneGeometry(this.PLANE_SIZE/2, this.PLANE_SIZE/2);
        const material = new THREE.MeshStandardMaterial({ color: 0x8b5a2b }); // brown dirt color
        const dirtPlane = new THREE.Mesh(geometry, material);
        dirtPlane.rotation.x = -Math.PI / 2;
        dirtPlane.position.y = 0;
        dirtPlane.receiveShadow = true;
        this.scene.add(dirtPlane);
    }

    async init() {
        const grassTexture = new THREE.TextureLoader().load('grass.jpg');
        const cloudTexture = new THREE.TextureLoader().load('cloud.jpg');
        cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;

        // Time Uniform
        this.startTime = Date.now();
        const timeUniform = { type: 'f', value: 0.0 };

        // Grass Shader
        this.grassUniforms = {
            textures: { value: [grassTexture, cloudTexture] },
            iTime: timeUniform,
        };

        this.grassMaterial = new THREE.ShaderMaterial({
            uniforms: this.grassUniforms,
            vertexShader: grassVertShader,
            fragmentShader: grassFragShader,
            vertexColors: true,
            side: THREE.DoubleSide,
        });

        this.generateField();
    }

    convertRange(val: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
        return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
    }

    generateBlade(center: THREE.Vector3, vArrOffset: number, uv: number[]) {
        const MID_WIDTH = this.BLADE_WIDTH * 0.5;
        const TIP_OFFSET = 0.1;
        const height = this.BLADE_HEIGHT + Math.random() * this.BLADE_HEIGHT_VARIATION;

        const yaw = Math.random() * Math.PI * 2;
        const yawUnitVec = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
        const tipBend = Math.random() * Math.PI * 2;
        const tipBendUnitVec = new THREE.Vector3(Math.sin(tipBend), 0, -Math.cos(tipBend));

        // Find the Bottom Left, Bottom Right, Top Left, Top right, Top Center vertex positions
        const bl = new THREE.Vector3().addVectors(
            center,
            new THREE.Vector3().copy(yawUnitVec).multiplyScalar((this.BLADE_WIDTH / 2) * 1)
        );
        const br = new THREE.Vector3().addVectors(
            center,
            new THREE.Vector3().copy(yawUnitVec).multiplyScalar((this.BLADE_WIDTH / 2) * -1)
        );
        const tl = new THREE.Vector3().addVectors(
            center,
            new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * 1)
        );
        const tr = new THREE.Vector3().addVectors(
            center,
            new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * -1)
        );
        const tc = new THREE.Vector3().addVectors(
            center,
            new THREE.Vector3().copy(tipBendUnitVec).multiplyScalar(TIP_OFFSET)
        );

        tl.y += height / 2;
        tr.y += height / 2;
        tc.y += height;

        // Vertex Colors
        const black = [0, 0, 0];
        const gray = [0.5, 0.5, 0.5];
        const white = [1.0, 1.0, 1.0];

        const verts = [
            { pos: bl.toArray(), uv: uv, color: black },
            { pos: br.toArray(), uv: uv, color: black },
            { pos: tr.toArray(), uv: uv, color: gray },
            { pos: tl.toArray(), uv: uv, color: gray },
            { pos: tc.toArray(), uv: uv, color: white },
        ];

        const indices = [
            vArrOffset,
            vArrOffset + 1,
            vArrOffset + 2,
            vArrOffset + 2,
            vArrOffset + 4,
            vArrOffset + 3,
            vArrOffset + 3,
            vArrOffset,
            vArrOffset + 2,
        ];

        return { verts, indices };
    }

    generateField() {
        const positions: number[] = [];
        const uvs: number[] = [];
        const indices: number[] = [];
        const colors: number[] = [];

        for (let i = 0; i < this.BLADE_COUNT; i++) {
            const VERTEX_COUNT = 5;
            const surfaceMin = (this.PLANE_SIZE / 2) * -1;
            const surfaceMax = this.PLANE_SIZE / 2;
            const radius = this.PLANE_SIZE / 2;

            const r = radius * Math.sqrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);

            const pos = new THREE.Vector3(x, 0, y);

            const uv = [
                this.convertRange(pos.x, surfaceMin, surfaceMax, 0, 1),
                this.convertRange(pos.z, surfaceMin, surfaceMax, 0, 1),
            ];

            const blade = this.generateBlade(pos, i * VERTEX_COUNT, uv);
            blade.verts.forEach(
                (vert: { pos: THREE.Vector3Tuple; uv: number[]; color: number[] }) => {
                    positions.push(...vert.pos);
                    uvs.push(...vert.uv);
                    colors.push(...vert.color);
                }
            );
            blade.indices.forEach((indice) => indices.push(indice));
        }
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geom.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        geom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        geom.setIndex(indices);
        geom.computeVertexNormals();

        const mesh = new THREE.Mesh(geom, this.grassMaterial);
        this.scene.add(mesh);
    }

    animate() {
        if (this.startTime && this.grassUniforms) {
            const elapsedTime = Date.now() - this.startTime;
            this.grassUniforms.iTime.value = elapsedTime;
        }
    }
}
