
import React, { useRef, useEffect, useState, MouseEvent } from 'react';
import PenIcon from './icons/PenIcon';
import EraserIcon from './icons/EraserIcon';
import TrashIcon from './icons/TrashIcon';

type Tool = 'pen' | 'eraser';

const Blackboard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<Tool>('pen');
    const [color, setColor] = useState('#FFFFFF');
    const [lineWidth, setLineWidth] = useState(5);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            if(canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
                const context = canvas.getContext('2d');
                if (context) {
                    context.lineCap = 'round';
                    context.lineJoin = 'round';
                    context.strokeStyle = color;
                    context.lineWidth = lineWidth;
                    contextRef.current = context;
                }
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);
    
    useEffect(() => {
        if(contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = lineWidth;
        }
    }, [color, lineWidth]);

    const startDrawing = (event: MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = event.nativeEvent;
        if (contextRef.current) {
            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
            setIsDrawing(true);
        }
    };

    const finishDrawing = () => {
        if (contextRef.current) {
            contextRef.current.closePath();
            setIsDrawing(false);
        }
    };

    const draw = (event: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !contextRef.current) {
            return;
        }
        const { offsetX, offsetY } = event.nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        
        if (tool === 'pen') {
            contextRef.current.globalCompositeOperation = 'source-over';
        } else {
            contextRef.current.globalCompositeOperation = 'destination-out';
        }

        contextRef.current.stroke();
    };
    
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if(canvas && contextRef.current) {
            contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    const ToolButton = ({ onClick, currentTool, toolName, children }: { onClick: () => void; currentTool: Tool; toolName: Tool; children: React.ReactNode }) => (
        <button onClick={onClick} className={`p-2 rounded ${currentTool === toolName ? 'bg-cyan-500' : 'bg-gray-600 hover:bg-gray-500'}`}>
            {children}
        </button>
    );

    return (
        <div className="w-full h-full bg-gray-900 flex flex-col rounded-lg overflow-hidden">
            <div className="bg-gray-800 p-2 flex items-center space-x-4">
                <ToolButton onClick={() => setTool('pen')} currentTool={tool} toolName='pen'>
                    <PenIcon className="w-6 h-6 text-white"/>
                </ToolButton>
                <ToolButton onClick={() => setTool('eraser')} currentTool={tool} toolName='eraser'>
                    <EraserIcon className="w-6 h-6 text-white"/>
                </ToolButton>
                 <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 bg-gray-800 border-none cursor-pointer" />
                 <input type="range" min="1" max="50" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} />
                 <button onClick={clearCanvas} className="p-2 rounded bg-red-600 hover:bg-red-500 ml-auto">
                    <TrashIcon className="w-6 h-6 text-white" />
                 </button>
            </div>
            <div className="flex-grow relative">
                 <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                    onMouseLeave={finishDrawing}
                    className="absolute top-0 left-0"
                />
            </div>
        </div>
    );
};

export default Blackboard;
