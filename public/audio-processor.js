// audio-processor.js
// class AudioProcessor extends AudioWorkletProcessor {
//     process(inputs, outputs, parameters) {
//       const input = inputs[0];
//       const output = outputs[0];
  
//       for (let channel = 0; channel < input.length; ++channel) {
//         const inputChannel = input[channel];
//         // const outputChannel = output[channel];
  
//         // Copy input to output
//         // for (let i = 0; i < inputChannel.length; ++i) {
//         //   outputChannel[i] = inputChannel[i];
//         // }
  
//         // Send the audio data to the main thread
//         this.port.postMessage(inputChannel);
//       }
  
//       return true;
//     }
//   }

class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
      super();
      this.lastLogTime = 0;
    }
  
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      const output = outputs[0];
  
      if (input.length > 0) {
        const inputChannel = input[0];
        
        // Calculate current time using currentFrame and sampleRate
        const currentTime = currentFrame / sampleRate;
        if (currentTime - this.lastLogTime >= 1) {
          console.log('Audio processor received input:', inputChannel.length);
          this.lastLogTime = currentTime;
        }
  
        // Downsample to 16kHz
        const downsampled = this.downsample(inputChannel, sampleRate, 16000);
        
        // Send the downsampled data to the main thread
        this.port.postMessage(downsampled);
      } else {
        console.warn('No input received in audio processor');
      }
  
      return true;
    }
  

  downsample(buffer, fromSampleRate, toSampleRate) {
    const sampleRateRatio = Math.round(fromSampleRate / toSampleRate);
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0, count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }
}

  
  registerProcessor('audio-processor', AudioProcessor);