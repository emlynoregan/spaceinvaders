import subprocess
import time
import webbrowser
import sys
import os

def main():
    print("🚀 Starting Space Invaders Local Development Server...")
    
    # Check if we're in the correct directory
    if not os.path.exists('README.md'):
        print("❌ Please run this script from the spaceinvaders directory")
        sys.exit(1)
    
    try:
        # Start game server  
        print("🎮 Starting game server...")
        game_process = subprocess.Popen(['python', '-m', 'http.server', '8000'])
        time.sleep(2)
        
        print("✅ Server started!")
        print("🌐 Opening game at http://localhost:8000")
        webbrowser.open('http://localhost:8000')
        
        print("\n🎮 Space Invaders Development Server Running")
        print("📝 Game will be available at: http://localhost:8000")
        print("🔧 Make changes to files and refresh browser to see updates")
        print("⏹️  Press Ctrl+C to stop server...")
        
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Stopping server...")
        game_process.terminate()
        print("👋 Development server stopped!")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("📋 Make sure Python is installed and available in PATH")
        sys.exit(1)

if __name__ == "__main__":
    main() 