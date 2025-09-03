import React from 'react';
import '../App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Export Joyride steps (single video step)
export const joyrideSteps = [
  {
    target: 'body',
    placement: 'center',
    disableBeacon: true,
    content: (
      <div style={{ textAlign: 'center' }}>
        <h2>Analog Climate Explorer: Wisconsin</h2>
        <p>Watch this short walkthrough to learn how to use the tool:</p>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <div
            style={{
              position: 'relative',
              width: 'min(90vw, 900px)',
              aspectRatio: '16 / 9',
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/jsALl0JmkMA?si=EHJ_hK8FSZA6OFac" 
              title="Analog Climate Explorer Walkthrough"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    ),
  },
];
