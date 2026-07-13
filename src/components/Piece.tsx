interface PieceProps {
  index: number;
  position: {
    x: number;
    y: number;
  };
}

const Piece = ({ position }: PieceProps) => {
  return (
    <div style={{ left: position.x, top: position.y }} className="point valid-move"></div>
  );
};

export default Piece;
