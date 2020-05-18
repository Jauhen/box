import React from 'react';
import './App.css';
import Box from './Box';

function roundToPrecision(x, precision) {
  var y = +x + (precision === undefined ? 0.5 : precision / 2);
  return y - (y % (precision === undefined ? 1 : +precision));
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      length: 100,
      width: 60,
      height: 40,
      thickness: 2,
      sections: [100],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSectionsSizeChange = this.handleSectionsSizeChange.bind(this);
    this.handleSectionLengthChange = this.handleSectionLengthChange.bind(this);
    setTimeout(() => this.updateDownloadLinks(), 100);
  }

  updateDownloadLinks() {
    this.setState({
      topName: `top-${this.state.length}-${this.state.width}-${this.state.height}.svg`,
    });
    const topSvg = document.getElementById('top_svg').innerHTML;
    const topData = new Blob([topSvg], { type: 'text/plain' });
    const topUrl = window.URL.createObjectURL(topData);
    this.setState({ topUrl: topUrl });
    this.setState({
      topWidth: document.getElementById('top_svg').dataset.width,
    });

    this.setState({
      bottomName: `bottom-${this.state.length}-${this.state.width}-${this.state.height}.svg`,
    });
    const bottomSvg = document.getElementById('bottom_svg').innerHTML;
    const bottomData = new Blob([bottomSvg], { type: 'text/plain' });
    const bottomUrl = window.URL.createObjectURL(bottomData);
    this.setState({ bottomUrl: bottomUrl });
    this.setState({
      bottomWidth: document.getElementById('bottom_svg').dataset.width,
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.id;
    const value = target.value;
    const size = isNaN(parseFloat(value))
      ? this.state[name]
      : parseFloat(value);
    this.setState({ [name]: size });

    if (name === 'length') {
      const sections = this.state.sections.slice();
      const rest = value ;
      const total = sections.reduce((sum, val) => sum + val);
      for (let i = 0; i < sections.length; i++) {
        sections[i] = roundToPrecision((sections[i] * rest) / total, 0.01);
      }
      this.setState({ sections });
    }

    setTimeout(() => this.updateDownloadLinks(), 100);
  }

  handleSectionsSizeChange(event) {
    const value = parseInt(event.target.value);
    const sectionSize = roundToPrecision(this.state.length / value, 0.01);
    this.setState({
      sections: Array.from({ length: value }, () => sectionSize),
    });
    setTimeout(() => this.updateDownloadLinks(), 100);
  }

  handleSectionLengthChange(event) {
    const value = parseFloat(event.target.value);
    if (isNaN(value)) {
      return;
    }
    const index = parseInt(event.target.id.split('-')[1]);
    const sections = this.state.sections.slice();
    sections[index] = value;
    const rest =
      this.state.length -
      sections.slice(0, index + 1).reduce((sum, val) => sum + val);
    if (rest > 0) {
      const total = sections.slice(index + 1).reduce((sum, val) => sum + val);
      for (let i = index + 1; i < sections.length; i++) {
        sections[i] = roundToPrecision((sections[i] * rest) / total, 0.01);
      }
    }
    this.setState({ sections });

    setTimeout(() => this.updateDownloadLinks(), 100);
  }

  render() {
    const start = this.state.height * 2 + this.state.thickness * 2 + 10;
    return (
      <div className='container'>
        <div className='leftPanel'>
          <div>
            <label htmlFor='sections'>Sections</label>
            <br />
            <input
              id='sections'
              type='range'
              list='tickmarks'
              min='1'
              max='8'
              value={this.state.sections.length}
              onChange={this.handleSectionsSizeChange}
              style={{ width: '100px' }}
            />
            <datalist id='tickmarks'>
              <option value='1' label='1'></option>
              <option value='2' label='2'></option>
              <option value='3' label='3'></option>
              <option value='4' label='4'></option>
              <option value='5' label='5'></option>
              <option value='6' label='6'></option>
              <option value='7' label='7'></option>
              <option value='8' label='8'></option>
            </datalist>
          </div>
          <div>
            <label htmlFor='length'>Length</label>
            <br />
            <input
              id='length'
              type='number'
              size='5'
              min='0'
              max='250'
              value={this.state.length}
              onChange={this.handleInputChange}
            />
            mm
          </div>
          <div>
            <label htmlFor='width'>Width</label>
            <br />
            <input
              id='width'
              type='number'
              size='5'
              min='0'
              max='250'
              value={this.state.width}
              onChange={this.handleInputChange}
            />
            mm
          </div>
          <div>
            <label htmlFor='height'>Height</label>
            <br />
            <input
              id='height'
              type='number'
              size='5'
              min='0'
              max='150'
              value={this.state.height}
              onChange={this.handleInputChange}
            />
            mm
          </div>
          {this.state.sections.map((val, index) => (
            <div key={index}>
              <label htmlFor={`section-${index}`}>
                Section {index + 1} size
              </label>
              <br />
              <input
                id={`section-${index}`}
                type='number'
                size='5'
                min='0'
                max='250'
                value={val}
                onChange={this.handleSectionLengthChange}
              />
              mm
            </div>
          ))}
          <div>
            <label htmlFor='thickness'>Thickness</label>
            <br />
            <input
              id='thickness'
              type='number'
              min='0'
              max='20'
              size='5'
              value={this.state.thickness}
              onChange={this.handleInputChange}
            />
            mm
          </div>
          <div>
            <a href={this.state.topUrl} download={this.state.topName}>
              Download top box
            </a>
            <br />
            (Width: {this.state.topWidth}mm)
            <br />
            <br />
            <a href={this.state.bottomUrl} download={this.state.bottomName}>
              Download bottom box
            </a>
            <br />
            (Width: {this.state.bottomWidth}mm)
            <br />
          </div>
        </div>
        <div className='rightPanel'>
          <Box
            width={this.state.width}
            length={this.state.length}
            height={this.state.height}
            thickness={this.state.thickness}
            sections={this.state.sections}
            startx={start}
            starty={start}
          />
        </div>
      </div>
    );
  }
}

export default App;
