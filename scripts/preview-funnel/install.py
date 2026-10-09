#!/usr/bin/env python3
"""Install the local private board; no remote dependencies or new service accounts."""
import os,plistlib,shutil,subprocess,sys
from pathlib import Path
source=Path(__file__).resolve().parent
base=Path.home()/'Business Research/website-preview-funnel';runtime=base/'runtime';runtime.mkdir(parents=True,exist_ok=True);os.chmod(base,0o700)
for name in ['board.py','board.html','board.js','board.css','publish.py','import_email.py','README.md']:
 shutil.copyfile(source/name,runtime/name)
agent=Path.home()/'Library/LaunchAgents/site.michaelmck.preview-board.plist';agent.parent.mkdir(parents=True,exist_ok=True)
data={'Label':'site.michaelmck.preview-board','ProgramArguments':[sys.executable,str(runtime/'board.py'),'serve','--port','8854'],'RunAtLoad':True,'KeepAlive':True,'WorkingDirectory':str(runtime),'StandardOutPath':str(base/'board.log'),'StandardErrorPath':str(base/'board-error.log'),'EnvironmentVariables':{'PREVIEW_FUNNEL_DATA':str(base),'PATH':'/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin'}}
agent.write_bytes(plistlib.dumps(data));target='gui/'+str(os.getuid())
subprocess.run(['launchctl','bootout',target,str(agent)],capture_output=True)
p=subprocess.run(['launchctl','bootstrap',target,str(agent)],capture_output=True,text=True)
if p.returncode:raise SystemExit(p.stderr)
print('Private board installed: http://127.0.0.1:8854/')
