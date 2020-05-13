import React from 'react';
import './App.css';

// const width = 575;
// const length = 1150;
// const height = 250;
// const startX = 550;
// const startY = 550;
// const thickness = 14;
// const section1length = 825;

class Box2Sections extends React.Component {
  render() {
    return box(
      this.props.width,
      this.props.length,
      this.props.height,
      this.props.section1length,
      this.props.thickness,
      this.props.startX,
      this.props.startY
    );
  }
}

function box(width, length, height, section1length, thickness, startX, startY) {
  console.log(width, length, height, section1length, thickness, startX, startY);

  const cutPath = `M ${startX},${startY}

    ${startX - thickness},${startY}
    ${startX - thickness},${startY - width / 2}
    ${startX - height + thickness},${startY - width / 2}
    ${startX - height + thickness},${startY}

    ${startX - height},${startY}
    ${startX - height - thickness},${startY + thickness}
    ${startX - height * 2},${startY + thickness}
    ${startX - height * 2},${startY + section1length - thickness}

    ${startX - height - thickness},${startY + section1length - thickness}
    ${startX - height - thickness},${startY + section1length + thickness}
    ${startX - height * 2},${startY + section1length + thickness}
    ${startX - height * 2},${startY + length - thickness}
    ${startX - height - thickness},${startY + length - thickness}
    ${startX - height},${startY + length}

    ${startX - height + thickness},${startY + length}
    ${startX - height + thickness},${startY + length + width / 2}
    ${startX - thickness},${startY + length + width / 2}
    ${startX - thickness},${startY + length}

    ${startX},${startY + length}
    ${startX},${startY + length + height}
    ${startX + thickness},${startY + length + height + thickness}
    ${startX + thickness},${startY + length + height * 2}
    ${startX + width - thickness},${startY + length + height * 2}
    ${startX + width - thickness},${startY + length + height + thickness}
    ${startX + width},${startY + length + height}
    ${startX + width},${startY + length}

    ${startX + width + thickness},${startY + length}
    ${startX + width + thickness},${startY + length + width / 2}
    ${startX + width + height - thickness},${startY + length + width / 2}
    ${startX + width + height - thickness},${startY + length}

    ${startX + width + height},${startY + length}
    ${startX + width + height + thickness},${startY + length - thickness}
    ${startX + width + height * 2},${startY + length - thickness}

    ${startX + width + height * 2},${startY + section1length + thickness}
    ${startX + width + height + thickness},${startY +
    section1length +
    thickness}
    ${startX + width + height + thickness},${startY +
    section1length -
    thickness}
    ${startX + width + height * 2},${startY + section1length - thickness}

    ${startX + width + height * 2},${startY + thickness}
    ${startX + width + height + thickness},${startY + thickness}
    ${startX + width + height},${startY}

    ${startX + width + height - thickness},${startY}
    ${startX + width + height - thickness},${startY - width / 2}
    ${startX + width + thickness},${startY - width / 2}
    ${startX + width + thickness},${startY}

    ${startX + width},${startY}
    ${startX + width},${startY - height}
    ${startX + width - thickness},${startY - height - thickness}
    ${startX + width - thickness},${startY - height * 2}
    ${startX + thickness},${startY - height * 2}
    ${startX + thickness},${startY - height - thickness}
    ${startX},${startY - height}
    ${startX},${startY}`;

  const scoreMain = `M ${startX},${startY} 
    ${startX},${startY + length} 
    ${startX + width},${startY + length}
    ${startX + width},${startY}
    ${startX},${startY}`;

  const scoreLeftFlap = `M ${startX - height},${startY} 
    ${startX - height},${startY + length}`;

  const scoreLeftFlapOut = `M ${startX - height - thickness},${startY +
    thickness}
    ${startX - height - thickness},${startY + section1length - thickness}
  M ${startX - height - thickness},${startY + section1length + thickness} 
    ${startX - height - thickness},${startY + length - thickness}`;

  const scoreRightFlap = `M ${startX + width + height},${startY} 
    ${startX + width + height},${startY + length}`;

  const scoreRightFlapOut = `M ${startX + width + height + thickness},${startY +
    thickness}
    ${startX + width + height + thickness},${startY +
    section1length -
    thickness}
  M ${startX + width + height + thickness},${startY +
    section1length +
    thickness} 
    ${startX + width + height + thickness},${startY + length - thickness}`;

  const scoreTopFlap = `M ${startX},${startY - height} 
    ${startX + width},${startY - height}`;

  const scoreTopFlapOut = `M ${startX + thickness},${startY -
    height -
    thickness} 
    ${startX + width - thickness},${startY - height - thickness}`;

  const scoreBottomFlap = `M ${startX},${startY + length + height} 
    ${startX + width},${startY + length + height}`;

  const scoreBottomFlapOut = `M ${startX + thickness},${startY +
    length +
    height +
    thickness} 
    ${startX + width - thickness},${startY + length + height + thickness}`;

  const scoreFlaps = `M ${startX - thickness},${startY} ${startX -
    height +
    thickness},${startY}
  M ${startX - thickness},${startY + length} ${startX -
    height +
    thickness},${startY + length}
  M ${startX + width + thickness},${startY} ${startX +
    width +
    height -
    thickness},${startY}
  M ${startX + width + thickness},${startY + length} ${startX +
    width +
    height -
    thickness},${startY + length}`;

  const half = thickness / 2;

  const insertCut = `M ${startX + half},${startY + half}

    ${startX + half},${startY + half * 2}
    ${startX - height + half * 2},${startY + half * 2}
    ${startX - height + half * 2},${startY + section1length - half}
    ${startX + half},${startY + section1length - half}

    ${startX + half},${startY + section1length + half}
    ${startX + half - section1length / 2},${startY + section1length + half}
    ${startX + half - section1length / 2},${startY +
    section1length +
    height -
    half}
    ${startX + half},${startY + section1length + height - half}

    ${startX + half},${startY + section1length + height + half}
    ${startX + half - (length - section1length) / 2},${startY +
    section1length +
    height +
    half}
    ${startX + half - (length - section1length) / 2},${startY +
    section1length +
    height * 2 -
    half}
    ${startX + half},${startY + section1length + height * 2 - half}

    ${startX + half},${startY + section1length + height * 2 + half}
    ${startX - height + half * 2},${startY + section1length + height * 2 + half}
    ${startX - height + half * 2},${startY + length + height * 2 - half * 2}
    ${startX + half},${startY + length + height * 2 - half * 2}

    ${startX + half},${startY + length + height * 2 - half}

    ${startX + half},${startY + length + height * 2}
    ${startX + half - (length - section1length) / 2},${startY +
    length +
    height * 2}
    ${startX + half - (length - section1length) / 2},${startY +
    length +
    height * 3 -
    half * 2}
    ${startX + half},${startY + length + height * 3 - half * 2}

    ${startX + half},${startY + length + height * 3 - half * 2}
    ${startX + width - half},${startY + length + height * 3 - half * 2}

    ${startX + width - half},${startY + length + height * 3 - half * 2}
    ${startX + width - half + (length - section1length) / 2},${startY +
    length +
    height * 3 -
    half * 2}
    ${startX + width - half + (length - section1length) / 2},${startY +
    length +
    height * 2}
    ${startX + width - half},${startY + length + height * 2}
    
    ${startX + width - half},${startY + length + height * 2 - half}

    ${startX + width - half},${startY + length + height * 2 - half * 2}
    ${startX + width + height - half * 2},${startY +
    length +
    height * 2 -
    half * 2}
    ${startX + width + height - half * 2},${startY +
    section1length +
    height * 2 +
    half}
    ${startX + width - half},${startY + section1length + height * 2 + half}

    ${startX + width - half},${startY + section1length + height + height - half}
    ${startX + width - half + (length - section1length) / 2},${startY +
    section1length +
    height +
    height -
    half}
    ${startX + width - half + (length - section1length) / 2},${startY +
    section1length +
    height +
    half}
    ${startX + width - half},${startY + section1length + height + half}

    ${startX + width - half},${startY + section1length + height - half}
    ${startX + width - half + section1length / 2},${startY +
    section1length +
    height -
    half}
    ${startX + width - half + section1length / 2},${startY +
    section1length +
    half}
    ${startX + width - half},${startY + section1length + half}

    ${startX + width - half},${startY + section1length - half}
    ${startX + width + height - half * 2},${startY + section1length - half}
    ${startX + width + height - half * 2},${startY + half * 2}
    ${startX + width - half},${startY + half * 2}

    ${startX + width - half},${startY + half}

    ${startX + width - half},${startY}
    ${startX + width - half + section1length / 2},${startY}
    ${startX + width - half + section1length / 2},${startY - height + half}

    ${startX + width - half},${startY - height + half}
    ${startX + half},${startY - height + half}

    ${startX + half - section1length / 2},${startY - height + half}
    ${startX + half - section1length / 2},${startY}
    ${startX + half},${startY}

    ${startX + half},${startY + half}`;

  const insertScore = `
  M ${startX + half},${startY + half}
    ${startX + width - half},${startY + half}
  M ${startX + half},${startY + section1length}
    ${startX + width - half},${startY + section1length}
  M ${startX + half},${startY + section1length + height - half / 2}
    ${startX + width - half},${startY + section1length + height - half / 2}
  M ${startX + half},${startY + section1length + height + half / 2}
    ${startX + width - half},${startY + section1length + height + half / 2}
  M ${startX + half},${startY + section1length + height * 2}
    ${startX + width - half},${startY + section1length + height * 2}
  M ${startX + half},${startY + height * 2 + length - half}
    ${startX + width - half},${startY + height * 2 + length - half}
  
  M ${startX + half},${startY - height + half}
    ${startX + half},${startY + length + height * 3 - half * 2}
  M ${startX + width - half},${startY - height + half}
    ${startX + width - half},${startY + length + height * 3 - half * 2}
  `;

  const totalTopWidth = height * 4 + width;
  const totalBottomWidth = Math.max(
    length - section1length - half * 2 + width,
    section1length - half * 2 + width,
    height * 2 - half * 4 + width
  );

  return (
    <div className='boxesContainers'>
      <div className='svgContainer' id='top_svg' data-width={totalTopWidth}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          version='1.1'
          viewBox='0 0 215 279'
          preserveAspectRatio='xMinYMin meet'>
          <title>Box with sections</title>
          <g
            className='cut'
            stroke='rgb(220,20,60)'
            fill='none'
            strokeWidth='0.2'>
            <path className='cut' id='outside' d={cutPath} />
          </g>
          <g
            className='fold'
            stroke='rgb(0, 191, 255)'
            fill='none'
            strokeWidth='0.2'
            strokeDasharray='1,1'>
            <path
              className='fold'
              id='MAIN'
              d={`${scoreMain} ${scoreLeftFlap} ${scoreLeftFlapOut} ${scoreTopFlap}
            ${scoreTopFlapOut}
            ${scoreRightFlap}
            ${scoreRightFlapOut}
            ${scoreBottomFlap}
            ${scoreBottomFlapOut}
            ${scoreFlaps}`}
            />
          </g>
        </svg>
      </div>
      <div
        className='svgContainer'
        id='bottom_svg'
        data-width={totalBottomWidth}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 215 279'
          preserveAspectRatio='xMinYMin meet'>
          <title>Sections</title>
          <g
            className='cut'
            stroke='rgb(220,20,60)'
            fill='none'
            strokeWidth='.2'>
            <path className='cut' id='outside' d={insertCut} />
          </g>
          <g
            className='fold'
            stroke='rgb(0, 191, 255)'
            fill='none'
            strokeWidth='.2'
            strokeDasharray='1,1'>
            <path className='fold' id='INSERT' d={insertScore} />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Box2Sections;
