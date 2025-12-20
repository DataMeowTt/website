import React, { useState } from "react";

const ModalConfirmation = ({ onAction, title = "Xác nhận", message }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [start, setStart] = useState(null);

  const onMouseMove = (e) => {
    if (start) setOffset({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onMouseMove={onMouseMove} onMouseUp={() => setStart(null)}>
      <div className="bg-green-700 p-6 rounded-lg w-full max-w-md shadow-2xl cursor-move" 
           onMouseDown={(e) => setStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })}
           style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
        <h2 className="text-xl font-bold text-white mb-4 text-center">{title}</h2>
        <div className="text-white mb-6 text-center">{message}</div>
        <div className="flex justify-center gap-4">
          <button onClick={() => onAction("cancel")} className="bg-gray-300 px-6 py-2 rounded font-bold">Hủy</button>
          <button onClick={() => onAction("confirm")} className="bg-yellow-400 px-6 py-2 rounded font-bold">Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;