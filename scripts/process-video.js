#!/usr/bin/env node
/*
 * process-video.js
 *
 * Extracts still frames from a video file using ffmpeg.  Frames are
 * saved to an output directory (default: `assets/frames`) at a rate of
 * one frame per second.  Use this to capture key moments from a
 * gameplay or concept video for reference when designing your
 * playable.
 *
 * Usage:
 *   node scripts/process-video.js --input path/to/video.mp4 --output assets/frames
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--input' || arg === '-i') {
      opts.input = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      opts.output = args[++i];
    }
  }
  return opts;
}

function run() {
  const { input, output = 'assets/frames' } = parseArgs();
  if (!input) {
    console.error('Usage: node process-video.js --input <video> [--output <dir>]');
    process.exit(1);
  }
  // Ensure ffmpeg is available
  const ffmpeg = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  // Create output directory
  fs.mkdirSync(output, { recursive: true });
  // Build ffmpeg args: one frame per second
  const args = ['-i', input, '-vf', 'fps=1', path.join(output, 'frame-%04d.png')];
  console.log('Extracting frames to', output);
  const proc = spawn(ffmpeg, args, { stdio: 'inherit' });
  proc.on('exit', (code) => {
    if (code === 0) {
      console.log('Frame extraction complete.');
    } else {
      console.error('ffmpeg failed with exit code', code);
    }
  });
}

run();
// TODO: extract audio from video
// npm run process:video -- --input /Users/rotemlevi/repos/ai-hackathon/JPSC_Slot_GoldenPharoah_Video_720x1080_15s_WRP.mp4 --output assets/frames
