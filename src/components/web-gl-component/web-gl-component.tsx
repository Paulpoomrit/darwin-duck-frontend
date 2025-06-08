import styles from './web-gl-component.module.scss';
import cx from 'classnames';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export interface WebGLComponentProps {
    className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const WebGLComponent = ({ className }: WebGLComponentProps) => {
    const refContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const container = refContainer.current;
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 1.5;
        const renderer = new THREE.WebGLRenderer( {antialias: true} );
        renderer.setSize(container.clientWidth, container.clientHeight);


        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        // controls.target.set(0, 1, 0);

        const environmentTexture = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
        scene.environment = environmentTexture
        scene.background = environmentTexture

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight)

        container.appendChild(renderer.domElement);


        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshNormalMaterial({ wireframe: false });

        // const cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);

        const fbxLoader = new FBXLoader();
        fbxLoader.load(
            'Duck.FBX',
            (object) => {
                object.traverse(function (child) {
                    if ((child as THREE.Mesh).isMesh) {
                        (child as THREE.Mesh).material = material
                        if ((child as THREE.Mesh).material) {
                            ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
                        }
                    }
                })
                object.scale.set(.02, .02, .02)
                object.position.set(0,-0.5,0);
                scene.add(object)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error);
            }
        );

        let animationId: number;
        function animate() {
            animationId =  requestAnimationFrame(animate);
            controls.update();

            // cube.rotation.x += 0.01;
            // cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        }

        animate();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
            cancelAnimationFrame(animationId);
            renderer.dispose();
        };
    }, []);
    return (<div ref={refContainer} className={styles.webglcomponent}> </div>);
};
