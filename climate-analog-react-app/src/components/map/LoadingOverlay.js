import React from 'react';
import { PulseLoader } from 'react-spinners';

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(128, 128, 128, 0.5)', // Slight grey with reduced opacity
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const boxStyle = {
  backgroundColor: 'white',
  padding: '40px', // Padding around the text and spinner
  borderRadius: '5px', // Rounded corners
  boxShadow: '0px 20px 15px rgba(0, 0, 0, 0.5)', // Box shadow
  display: 'flex',
  flexDirection: 'column', // Stack items vertically
  alignItems: 'center', // Center items horizontally
};

const textStyle = {
  color: 'black',
  fontSize: '32px', // Increased font size
  marginBottom: '10px', // Space between text and spinner
  /*fontWeight: 'bold',*/
  /*fontFamily: 'Georgia',*/
};

const spinnerStyle = {
  marginBottom: '20px', // Space between text and spinner
}

const subtextStyle = {
  color: 'black',
  fontSize: '18px', // Increased font size
  /*fontWeight: 'bold',*/
  /*fontFamily: 'Georgia',*/
}

const LoadingOverlay = ({ loading }) => (
  loading && (
    <div style={overlayStyle}>
      <div style={boxStyle}>
      <div style={spinnerStyle}>
          <PulseLoader size={15} color={"red"} loading={loading} />
        </div>
        <div style={textStyle}>Calculating Climate Patterns...</div>
        <div style={subtextStyle}>Please wait, this could take a few seconds</div>
        
      </div>
    </div>
  )
);

export default LoadingOverlay;
