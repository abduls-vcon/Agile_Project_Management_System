import { useState } from "react";

export function useDragDrop() {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const onDragStart = (id: number) => (e: React.DragEvent) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id.toString());
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (handleDrop: (id: string) => void) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) handleDrop(id);
    setDraggedItem(null);
  };

  return { draggedItem, onDragStart, onDragOver, onDrop };
}