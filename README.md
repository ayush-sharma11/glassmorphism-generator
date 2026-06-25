# Glassmorphism Generator

A beautiful, interactive web application for designing advanced glassmorphism UI elements and exporting production-ready CSS and PNG images.

## Features

- **Multi-Layer Liquid Glass**: Generates a realistic frosted glass effect with distortion overlays, specular highlights, and edge glows.
- **Interactive Workspace**: Drag and drop your glass element, adjust its size, and preview it in real-time.
- **Extensive Controls**: Fine-tune blur, saturation, tint, shadows, borders, and complex light reflections.
- **Background Support**: Use built-in gradients, solid colors, or upload your own custom backgrounds to see how the glass interacts with different images.
- **Export to CSS**: Instantly copy the exact HTML structure and layered CSS required to reproduce your design in your own projects.
- **Export to PNG**: Download a high-quality rasterized version of your glass element overlaying the background.
- **Light / Dark Mode**: Fully responsive theme UI and native dark-mode color pickers.
- **Responsive Layout**: Includes a collapsible sidebar to maximize your canvas workspace.

## Development Setup

This project uses React and Vite.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Technologies Used

- **React 18** (with Hooks)
- **Vite** (for fast bundling and HMR)
- **Vanilla CSS** (custom design tokens and flex/grid layouts)
- **HTML5 Canvas API** (for PNG rasterization)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
