// vite.config.ts
import react from "file:///Users/munjunho/Desktop/BC-project/web38-Froxy/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.1_vite@5.4.10_@types+node@20.17.5_terser@5.36.0_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import { defineConfig } from "file:///Users/munjunho/Desktop/BC-project/web38-Froxy/node_modules/.pnpm/vite@5.4.10_@types+node@20.17.5_terser@5.36.0/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/munjunho/Desktop/BC-project/web38-Froxy/node_modules/.pnpm/vite-plugin-dts@4.3.0_@types+node@20.17.5_rollup@4.24.3_typescript@5.6.3_vite@5.4.10_@types+node@20.17.5_terser@5.36.0_/node_modules/vite-plugin-dts/dist/index.mjs";
import tsconfigPaths from "file:///Users/munjunho/Desktop/BC-project/web38-Froxy/node_modules/.pnpm/vite-tsconfig-paths@5.0.1_typescript@5.6.3_vite@5.4.10_@types+node@20.17.5_terser@5.36.0_/node_modules/vite-tsconfig-paths/dist/index.js";
var __vite_injected_original_dirname = "/Users/munjunho/Desktop/BC-project/web38-Froxy/packages/react-markdown";
var vite_config_default = defineConfig({
  base: "./",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setupTests.ts"]
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "@froxy/react-markdown",
      formats: ["es"],
      // 포맷 추가
      fileName: (format) => `index.${format}.js`
      // 포맷별 파일명
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        },
        exports: "named",
        // named exports 설정
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name].[ext]",
        entryFileNames: "[name].js",
        manualChunks: void 0,
        inlineDynamicImports: false
      }
    }
  },
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      include: ["src"],
      rollupTypes: true
      // 타입 번들링
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbXVuanVuaG8vRGVza3RvcC9CQy1wcm9qZWN0L3dlYjM4LUZyb3h5L3BhY2thZ2VzL3JlYWN0LW1hcmtkb3duXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbXVuanVuaG8vRGVza3RvcC9CQy1wcm9qZWN0L3dlYjM4LUZyb3h5L3BhY2thZ2VzL3JlYWN0LW1hcmtkb3duL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tdW5qdW5oby9EZXNrdG9wL0JDLXByb2plY3Qvd2ViMzgtRnJveHkvcGFja2FnZXMvcmVhY3QtbWFya2Rvd24vdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiAnLi8nLFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBzZXR1cEZpbGVzOiBbJy4vc3JjL3Rlc3Qvc2V0dXBUZXN0cy50cyddXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJylcbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICdAZnJveHkvcmVhY3QtbWFya2Rvd24nLFxuICAgICAgZm9ybWF0czogWydlcyddLCAvLyBcdUQzRUNcdUI5RjcgXHVDRDk0XHVBQzAwXG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCkgPT4gYGluZGV4LiR7Zm9ybWF0fS5qc2AgLy8gXHVEM0VDXHVCOUY3XHVCQ0M0IFx1RDMwQ1x1Qzc3Q1x1QkE4NVxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgIHJlYWN0OiAnUmVhY3QnLFxuICAgICAgICAgICdyZWFjdC1kb20nOiAnUmVhY3RET00nXG4gICAgICAgIH0sXG4gICAgICAgIGV4cG9ydHM6ICduYW1lZCcsIC8vIG5hbWVkIGV4cG9ydHMgXHVDMTI0XHVDODE1XG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnY2h1bmtzL1tuYW1lXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS5bZXh0XScsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnW25hbWVdLmpzJyxcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB1bmRlZmluZWQsXG4gICAgICAgIGlubGluZUR5bmFtaWNJbXBvcnRzOiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgZHRzKHtcbiAgICAgIHRzY29uZmlnUGF0aDogJy4vdHNjb25maWcuYXBwLmpzb24nLFxuICAgICAgaW5jbHVkZTogWydzcmMnXSxcbiAgICAgIHJvbGx1cFR5cGVzOiB0cnVlIC8vIFx1RDBDMFx1Qzc4NSBcdUJDODhcdUI0RTRcdUI5QzFcbiAgICB9KVxuICBdXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLG1CQUFtQjtBQU4xQixJQUFNLG1DQUFtQztBQVN6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixZQUFZLENBQUMsMEJBQTBCO0FBQUEsRUFDekM7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxJQUFJO0FBQUE7QUFBQSxNQUNkLFVBQVUsQ0FBQyxXQUFXLFNBQVMsTUFBTTtBQUFBO0FBQUEsSUFDdkM7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxTQUFTLFdBQVc7QUFBQSxNQUMvQixRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxhQUFhO0FBQUEsUUFDZjtBQUFBLFFBQ0EsU0FBUztBQUFBO0FBQUEsUUFDVCxnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixjQUFjO0FBQUEsUUFDZCxzQkFBc0I7QUFBQSxNQUN4QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxJQUFJO0FBQUEsTUFDRixjQUFjO0FBQUEsTUFDZCxTQUFTLENBQUMsS0FBSztBQUFBLE1BQ2YsYUFBYTtBQUFBO0FBQUEsSUFDZixDQUFDO0FBQUEsRUFDSDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
