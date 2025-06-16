import * as THREE from 'three';

export function getIntersects(
    event: MouseEvent,
    container: HTMLDivElement,
    camera: THREE.Camera,
    objects: THREE.Object3D[]
): THREE.Intersection[] {
    const rect = container.getBoundingClientRect();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(objects, true);
}