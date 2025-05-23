import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { parseImageFile, parseSvgFile } from "../utils/imageParser";

export function CanvasEditor() {
  const buttonClass = "px-4 py-1 rounded text-white hover:opacity-90";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Image | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });
  const [tempSize, setTempSize] = useState({ width: 400, height: 300 });

  // 新增导出弹窗状态和输入控制
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFileName, setExportFileName] = useState("laser-canvas");
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg" | "webp">("png");

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: "#fff",
    });

    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.cornerColor = "blue";
    fabric.Object.prototype.rotatingPointOffset = 30;

    fabricCanvasRef.current = canvas;

    canvas.on("selection:created", (e) => {
      if (e.selected && e.selected[0] instanceof fabric.Image) {
        setSelectedObject(e.selected[0]);
      }
    });
    canvas.on("selection:updated", (e) => {
      if (e.selected && e.selected[0] instanceof fabric.Image) {
        setSelectedObject(e.selected[0]);
      }
    });
    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    return () => {
      canvas.dispose();
    };
  }, [canvasSize]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "svg") {
          const group = await parseSvgFile(file);
          fabricCanvasRef.current?.add(group);
        } else {
          const img = await parseImageFile(file);
          if (img) {
            img.scaleToWidth(300);
            fabricCanvasRef.current?.add(img);
          }
        }
      }
      fabricCanvasRef.current?.renderAll();
    }
    e.target.value = "";
  };

  // 触发弹窗打开
  const openExportModal = () => setExportModalOpen(true);
  // 弹窗取消关闭
  const closeExportModal = () => setExportModalOpen(false);

  // 弹窗确认导出
  const handleExportConfirm = () => {
    if (!fabricCanvasRef.current) return;
    const dataUrl = fabricCanvasRef.current.toDataURL({ format: exportFormat });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${exportFileName}.${exportFormat}`;
    link.click();
    setExportModalOpen(false);
  };

  const applyFilter = (filter: fabric.IBaseFilter) => {
    if (selectedObject) {
      selectedObject.filters = selectedObject.filters || [];
      selectedObject.filters.push(filter);
      selectedObject.applyFilters();
      fabricCanvasRef.current?.renderAll();
    }
  };

  const clearFilters = () => {
    if (selectedObject) {
      selectedObject.filters = [];
      selectedObject.applyFilters();
      fabricCanvasRef.current?.renderAll();
    }
  };

  const deleteSelected = () => {
    if (selectedObject && fabricCanvasRef.current) {
      fabricCanvasRef.current.remove(selectedObject);
      setSelectedObject(null);
    }
  };

  const handleCanvasResize = () => {
    setCanvasSize(tempSize);
  };

  return (
    <div className="overflow-auto">
      <div className="flex gap-2 mb-2 flex-wrap">
        <input type="file" accept="image/*,.svg,.dxf" onChange={handleFileChange} multiple />
        <button
          onClick={openExportModal}
          className={`bg-blue-500 ${buttonClass}`}
        >
          导出图像
        </button>
        <div className="flex items-center gap-1">
          <label className="text-sm">宽度:</label>
          <input
            type="number"
            value={tempSize.width}
            onChange={(e) => setTempSize({ ...tempSize, width: parseInt(e.target.value) })}
            className="w-20 border rounded px-1 text-sm"
          />
          <label className="text-sm">高度:</label>
          <input
            type="number"
            value={tempSize.height}
            onChange={(e) => setTempSize({ ...tempSize, height: parseInt(e.target.value) })}
            className="w-20 border rounded px-1 text-sm"
          />
          <button
            onClick={handleCanvasResize}
            className={`bg-yellow-500 ${buttonClass}`}
          >
            应用尺寸
          </button>
        </div>
        {selectedObject && (
          <>
            <button onClick={() => applyFilter(new fabric.Image.filters.Grayscale())} className={`bg-gray-400 ${buttonClass}`}>灰度</button>
            <button onClick={() => applyFilter(new fabric.Image.filters.Sepia())} className={`bg-gray-600 ${buttonClass}`}>复古</button>
            <button onClick={() => applyFilter(new fabric.Image.filters.Brightness({ brightness: 0.1 }))} className={`bg-green-400 ${buttonClass}`}>亮度+</button>
            <button onClick={() => applyFilter(new fabric.Image.filters.Contrast({ contrast: 0.2 }))} className={`bg-green-600 ${buttonClass}`}>对比+</button>
            <button onClick={() => applyFilter(new fabric.Image.filters.HueRotation({ rotation: 0.3 }))} className={`bg-green-800 ${buttonClass}`}>色相</button>
            <button onClick={clearFilters} className={`bg-red-400 ${buttonClass}`}>清除滤镜</button>
            <button onClick={deleteSelected} className={`bg-red-600 ${buttonClass}`}>删除图像</button>
          </>
        )}
      </div>

      {/* 画布 */}
      <canvas ref={canvasRef} className="border shadow rounded-xl" />

      {/* 导出弹窗 */}
      {exportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">导出图像</h3>
            <label className="block mb-2">
              文件名：
              <input
                type="text"
                value={exportFileName}
                onChange={(e) => setExportFileName(e.target.value)}
                className="w-full border px-2 py-1 rounded mt-1"
              />
            </label>
            <label className="block mb-4">
              格式：
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as "png" | "jpeg" | "webp")}
                className="w-full border px-2 py-1 rounded mt-1"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WEBP</option>
              </select>
            </label>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeExportModal}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                取消
              </button>
              <button
                onClick={handleExportConfirm}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                导出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
