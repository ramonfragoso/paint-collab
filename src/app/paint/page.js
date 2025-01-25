"use client";
import { CANVAS_BG } from "@/utils/colors";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function CanvasDrawing() {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const contextRef = useRef(null);
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = CANVAS_BG;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 2;
    context.lineCap = "round";

    contextRef.current = context;
  }, []);

  const changeLineWidth = useCallback(() => {
    const context = contextRef.current;
    if (context) {
      if (color === CANVAS_BG) context.lineWidth = 25;
      else context.lineWidth = 3;
    }
  }, [color]);

  useEffect(() => {
    changeLineWidth();
  }, [color]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;

    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x, y);
    isDrawingRef.current = true;
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    const context = contextRef.current;
    if (!context) return;

    context.closePath();
    isDrawingRef.current = false;
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context.fillStyle = CANVAS_BG;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (context) {
      context.fillStyle = CANVAS_BG;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <>
      <div className="relative">
        <div className="absolute bg-gray-800 p-2 rounded-full flex flex-col gap-2 left-8 top-8">
          <button
            onClick={() => setColor("#dc2626")}
            data-color={color}
            className="border border-gray-500 rounded-full w-10 h-10 bg-red-600 data-[color=#dc2626]:border-white shadow-white"
          />
          <button
            onClick={() => setColor("#16a34a")}
            data-color={color}
            className="border border-gray-500 rounded-full w-10 h-10 bg-green-600 data-[color=#16a34a]:border-white"
          />
          <button
            onClick={() => setColor("#2563eb")}
            data-color={color}
            className="border border-gray-500 rounded-full w-10 h-10 bg-blue-600 data-[color=#2563eb]:border-white"
          />
          <button
            onClick={() => setColor("#ffffff")}
            data-color={color}
            className="border border-gray-500 rounded-full w-10 h-10 bg-white data-[color=#ffffff]:border-white"
          />
          <button
            onClick={() => setColor(CANVAS_BG)}
            data-color={color}
            className={`border border-gray-500 rounded-full w-10 h-10 bg-[${CANVAS_BG}] data-[color=${CANVAS_BG}]:border-white`}
          />
          <button
            onClick={() => clearCanvas()}
            data-color={color}
            className={`border border-gray-500 rounded-full w-10 h-10 bg-gray-500 flex items-center justify-center`}
          >
            <Image
              src="/icons/trash.png"
              className="w-6 h-6"
              width={1000}
              height={1000}
            />
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onResize={handleResize}
        style={{
          width: "100%",
          height: "100%",
          cursor: "crosshair",
          border: "2px solid black",
        }}
      />
    </>
  );
}
