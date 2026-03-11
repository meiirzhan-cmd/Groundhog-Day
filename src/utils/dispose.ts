import {
  type Object3D,
  type Material,
  Mesh,
  type Texture,
  type BufferGeometry,
} from "three";

/** Recursively dispose all geometries, materials, and textures from an Object3D tree */
export function disposeObject(obj: Object3D): void {
  obj.traverse((child) => {
    if (child instanceof Mesh) {
      disposeGeometry(child.geometry);
      disposeMaterial(child.material);
    }
  });
}

function disposeGeometry(geometry: BufferGeometry | undefined): void {
  geometry?.dispose();
}

function disposeMaterial(material: Material | Material[]): void {
  if (Array.isArray(material)) {
    material.forEach((m) => disposeSingleMaterial(m));
  } else {
    disposeSingleMaterial(material);
  }
}

function disposeSingleMaterial(material: Material): void {
  // Dispose any texture properties on the material
  for (const value of Object.values(material)) {
    if (value instanceof Object && "dispose" in value) {
      (value as Texture).dispose();
    }
  }
  material.dispose();
}
