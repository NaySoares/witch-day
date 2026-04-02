export const containerStyle = `
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180px;
  background: rgba(10, 10, 30, 0.95);
  border-top: 3px solid #a78bfa;
  display: none;
  z-index: 1000;
  font-family: 'Press Start 2P', Arial, sans-serif;
  box-sizing: border-box;
  flex-direction: row;
  align-items: stretch;
`;

export const imageStyle = `
  position: fixed;
  bottom: 0px;
  left: 32px;
  height: 55vh;
  width: 280px;
  object-fit: contain;
  object-position: bottom left;
  z-index: 1001;
  display: none;
  pointer-events: none;
  filter: drop-shadow(4px 0px 8px rgba(167, 139, 250, 0.4));
`;

export const wrapperStyle = `
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 24px 16px 336px;
  box-sizing: border-box;
  overflow: hidden;
`;

export const nameStyle = `
  color: #a78bfa;
  font-size: 11px;
  letter-spacing: 1px;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

export const textStyle = `
  color: #f0f0f0;
  font-size: 12px;
  line-height: 1.8;
  flex: 1;
`;

export const instructionStyle = `
  color: #6b7280;
  font-size: 9px;
  text-align: right;
  margin-top: 10px;
`;