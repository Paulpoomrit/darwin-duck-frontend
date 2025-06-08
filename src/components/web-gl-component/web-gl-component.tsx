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


        container.appendChild(renderer.domElement);


        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshNormalMaterial({ wireframe: true });

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        let animationId: number;
        function animate() {
            animationId =  requestAnimationFrame(animate);
            controls.update();

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

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
