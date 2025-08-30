"use client";

import React from "react";

const TetrisGridBackground = () => {
  const gridSize = 30; // 30x30网格，确保覆盖整个屏幕
  const cellSize = 80; // 80px格子尺寸，保持清晰度

  // 生成固定的俄罗斯方块网格
  const generateGrid = () => {
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    
    // 定义固定的俄罗斯方块布局 - 有疏密效果的分布
    const tetrisLayout = [
      // 左上角聚集区域
      { shape: [[1, 1, 1, 1]], row: 2, col: 3 },
      { shape: [[1, 1], [1, 1]], row: 3, col: 8 },
      { shape: [[0, 1, 0], [1, 1, 1]], row: 5, col: 12 },
      { shape: [[1, 0], [1, 0], [1, 1]], row: 7, col: 6 },
      { shape: [[0, 1], [0, 1], [1, 1]], row: 9, col: 15 },
      
      // 右上角聚集区域
      { shape: [[0, 1, 1], [1, 1, 0]], row: 1, col: 20 },
      { shape: [[1, 1, 0], [0, 1, 1]], row: 3, col: 24 },
      { shape: [[1, 1, 1, 1]], row: 5, col: 22 },
      { shape: [[1, 1], [1, 1]], row: 7, col: 26 },
      { shape: [[0, 1, 0], [1, 1, 1]], row: 9, col: 28 },
      
      // 中央聚集区域
      { shape: [[1, 0], [1, 0], [1, 1]], row: 12, col: 12 },
      { shape: [[0, 1], [0, 1], [1, 1]], row: 14, col: 16 },
      { shape: [[0, 1, 1], [1, 1, 0]], row: 16, col: 10 },
      { shape: [[1, 1, 0], [0, 1, 1]], row: 18, col: 14 },
      { shape: [[1, 1, 1, 1]], row: 20, col: 8 },
      
      // 左下角聚集区域
      { shape: [[1, 1], [1, 1]], row: 22, col: 2 },
      { shape: [[0, 1, 0], [1, 1, 1]], row: 24, col: 6 },
      { shape: [[1, 0], [1, 0], [1, 1]], row: 26, col: 10 },
      { shape: [[0, 1], [0, 1], [1, 1]], row: 28, col: 4 },
      { shape: [[0, 1, 1], [1, 1, 0]], row: 25, col: 15 },
      
      // 右下角聚集区域
      { shape: [[1, 1, 0], [0, 1, 1]], row: 22, col: 20 },
      { shape: [[1, 1, 1, 1]], row: 24, col: 24 },
      { shape: [[1, 1], [1, 1]], row: 26, col: 18 },
      { shape: [[0, 1, 0], [1, 1, 1]], row: 28, col: 22 },
      { shape: [[1, 0], [1, 0], [1, 1]], row: 25, col: 26 },
      
      // 独立分布的方块
      { shape: [[1, 1, 1, 1]], row: 1, col: 1 },
      { shape: [[1, 1], [1, 1]], row: 15, col: 1 },
      { shape: [[0, 1, 0], [1, 1, 1]], row: 10, col: 1 },
      { shape: [[1, 0], [1, 0], [1, 1]], row: 5, col: 1 },
      { shape: [[0, 1], [0, 1], [1, 1]], row: 20, col: 1 },
      
      // 右侧独立方块
      { shape: [[0, 1, 1], [1, 1, 0]], row: 1, col: 28 },
      { shape: [[1, 1, 0], [0, 1, 1]], row: 15, col: 28 },
      { shape: [[1, 1, 1, 1]], row: 10, col: 28 },
      { shape: [[1, 1], [1, 1]], row: 5, col: 28 },
      { shape: [[0, 1, 0], [1, 1, 1]], row: 20, col: 28 },
      
      // 顶部独立方块
      { shape: [[1, 0], [1, 0], [1, 1]], row: 0, col: 10 },
      { shape: [[0, 1], [0, 1], [1, 1]], row: 0, col: 20 },
      { shape: [[0, 1, 1], [1, 1, 0]], row: 0, col: 15 },
      
      // 底部独立方块
      { shape: [[1, 1, 0], [0, 1, 1]], row: 29, col: 10 },
      { shape: [[1, 1, 1, 1]], row: 29, col: 20 },
      { shape: [[1, 1], [1, 1]], row: 29, col: 15 },
    ];

    // 放置固定的俄罗斯方块
    tetrisLayout.forEach(({ shape, row, col }) => {
      // 检查整个方块是否在网格范围内
      let canPlace = true;
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
          if (shape[i][j] && (row + i >= gridSize || col + j >= gridSize)) {
            canPlace = false;
            break;
          }
        }
        if (!canPlace) break;
      }
      
      // 只有在完全在网格范围内时才放置
      if (canPlace) {
        for (let i = 0; i < shape.length; i++) {
          for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) {
              grid[row + i][col + j] = true;
            }
          }
        }
      }
    });
    
    return grid;
  };

  const grid = generateGrid();

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className="absolute inset-0 bg-[#5E7456] overflow-hidden">
        <div className="relative w-full h-full" style={{ width: '100%', height: '100%' }}>
          {grid.map((row, rowIndex) =>
            row.map((isTetris, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`absolute transition-all duration-300 z-0 ${
                  isTetris 
                    ? '' 
                    : ''
                }`}
                style={{
                  left: `${colIndex * cellSize}px`,
                  top: `${rowIndex * cellSize}px`,
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  backgroundColor: isTetris ? '#5E7456' : 'transparent',
                  boxShadow: isTetris 
                    ? 'inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3), 1px 1px 2px rgba(0,0,0,0.2)' 
                    : 'none',
                  border: isTetris ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(107,142,35,0.1)',
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TetrisGridBackground;
