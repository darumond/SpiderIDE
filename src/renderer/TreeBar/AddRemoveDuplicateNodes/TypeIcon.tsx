import React, { useEffect } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

type Props = {
  droppable: boolean;
  fileType?: string;
};
let icon_size = 23;
function CppIcon(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: `${icon_size}`, height: `${icon_size}` }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}

      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="m10 15.97.41 2.44c-.26.14-.68.27-1.24.39-.57.13-1.24.2-2.01.2-2.21-.04-3.87-.7-4.98-1.96C1.06 15.77.5 14.16.5 12.21c.05-2.31.72-4.08 2-5.32C3.82 5.64 5.46 5 7.44 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4L10 8.08l-1.06-.34c-.4-.1-.86-.15-1.39-.15-1.16-.01-2.12.36-2.87 1.1-.76.73-1.15 1.85-1.18 3.34 0 1.36.37 2.42 1.08 3.2.71.77 1.71 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.1-.32m.5-4.97h2V9h2v2h2v2h-2v2h-2v-2h-2v-2m7 0h2V9h2v2h2v2h-2v2h-2v-2h-2z" fill="#0288d1" />
      </svg>
    </SvgIcon>
  );
}
function HppIcon(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: `${icon_size}`, height: `${icon_size}` }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.757 19.818H6.751v-5.882q0-2.381-1.737-2.381-.868 0-1.438.663-.56.662-.56 1.718v5.882H0V4.533h3.016v6.508h.037Q4.24 9.239 6.247 9.239q3.51 0 3.51 4.239z" fill="#0277bd" aria-label="h" /><path d="M13.073 11.448v2h-2v2h2v2h2v-2h2v-2h-2v-2zm7 0v2h-2v2h2v2h2v-2h2v-2h-2v-2z" fill="#0277bd" /></svg>
    </SvgIcon>
  );
}
function PythonIcon(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: `${icon_size}`, height: `${icon_size}` }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.86 2A2.86 2.86 0 0 0 7 4.86v1.68h4.29c.39 0 .71.57.71.96H4.86A2.86 2.86 0 0 0 2 10.36v3.781a2.86 2.86 0 0 0 2.86 2.86h1.18v-2.68a2.85 2.85 0 0 1 2.85-2.86h5.25c1.58 0 2.86-1.271 2.86-2.851V4.86A2.86 2.86 0 0 0 14.14 2zm-.72 1.61c.4 0 .72.12.72.71s-.32.891-.72.891c-.39 0-.71-.3-.71-.89s.32-.711.71-.711z" fill="#3c78aa" /><path d="M17.959 7v2.68a2.85 2.85 0 0 1-2.85 2.859H9.86A2.85 2.85 0 0 0 7 15.389v3.75a2.86 2.86 0 0 0 2.86 2.86h4.28A2.86 2.86 0 0 0 17 19.14v-1.68h-4.291c-.39 0-.709-.57-.709-.96h7.14A2.86 2.86 0 0 0 22 13.64V9.86A2.86 2.86 0 0 0 19.14 7zM8.32 11.513l-.004.004c.012-.002.025-.001.038-.004zm6.54 7.276c.39 0 .71.3.71.89a.71.71 0 0 1-.71.71c-.4 0-.72-.12-.72-.71s.32-.89.72-.89z" fill="#fdd835" /></svg>

    </SvgIcon>
  );
}
function JSONIcon(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: `${icon_size}`, height: `${icon_size}` }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.759 3.975h1.783V5.76H5.759v4.458A1.783 1.783 0 0 1 3.975 12a1.783 1.783 0 0 1 1.784 1.783v4.459h1.783v1.783H5.759c-.954-.24-1.784-.803-1.784-1.783v-3.567a1.783 1.783 0 0 0-1.783-1.783H1.3v-1.783h.892a1.783 1.783 0 0 0 1.783-1.784V5.76A1.783 1.783 0 0 1 5.76 3.975m12.483 0a1.783 1.783 0 0 1 1.783 1.784v3.566a1.783 1.783 0 0 0 1.783 1.784h.892v1.783h-.892a1.783 1.783 0 0 0-1.783 1.783v3.567a1.783 1.783 0 0 1-1.783 1.783h-1.784v-1.783h1.784v-4.459A1.783 1.783 0 0 1 20.025 12a1.783 1.783 0 0 1-1.783-1.783V5.759h-1.784V3.975h1.784M12 14.675a.892.892 0 0 1 .892.892.892.892 0 0 1-.892.892.892.892 0 0 1-.891-.892.892.892 0 0 1 .891-.892m-3.566 0a.892.892 0 0 1 .891.892.892.892 0 0 1-.891.892.892.892 0 0 1-.892-.892.892.892 0 0 1 .892-.892m7.133 0a.892.892 0 0 1 .891.892.892.892 0 0 1-.891.892.892.892 0 0 1-.892-.892.892.892 0 0 1 .892-.892z" fill="#fbc02d" /></svg>

    </SvgIcon>
  );
}

function CMakeIcon(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: `${icon_size}`, height: `${icon_size}` }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.94 2.984 2.928 21.017l9.875-8.47z" fill="#1e88e5" /><path d="m11.958 2.982.002.29 1.312 14.499-.002.006.023.26 7.363 2.978h.415l-.158-.31-.114-.228h-.001l-8.84-17.494z" fill="#e53935" /><path d="m8.558 16.13-5.627 4.884h17.743v-.016L8.559 16.13z" fill="#7cb342" /></svg>

    </SvgIcon>
  );
}

function YAMLIcon(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: `${icon_size}`, height: `${icon_size}` }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2m12 16v-2H9v2h9m-4-4v-2H6v2z" fill="#FF5252" /></svg>

    </SvgIcon>
  );
}

function GitIcon(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: `${icon_size}`, height: `${icon_size}` }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.6 10.59 8.38 4.8l1.69 1.7c-.24.85.15 1.78.93 2.23v5.54c-.6.34-1 .99-1 1.73a2 2 0 0 0 2 2 2 2 0 0 0 2-2c0-.74-.4-1.39-1-1.73V9.41l2.07 2.09c-.07.15-.07.32-.07.5a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2c-.18 0-.35 0-.5.07L13.93 7.5a1.98 1.98 0 0 0-1.15-2.34c-.43-.16-.88-.2-1.28-.09L9.8 3.38l.79-.78c.78-.79 2.04-.79 2.82 0l7.99 7.99c.79.78.79 2.04 0 2.82l-7.99 7.99c-.78.79-2.04.79-2.82 0L2.6 13.41c-.79-.78-.79-2.04 0-2.82z" fill="#e64a19" /></svg>

    </SvgIcon>
  );
}
function MarkDownIcon(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: `${icon_size}`, height: `${icon_size}` }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z" fill="#42a5f5" /></svg>

    </SvgIcon>
  );
}

function GitLabIcon(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: `${icon_size}`, height: `${icon_size}` }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><path d="m449.14 208.669-.555-1.482L392.51 60.92a14.547 14.547 0 0 0-5.767-6.956 14.812 14.812 0 0 0-22.244 8.464l-37.85 115.877H173.372l-37.85-115.877a14.838 14.838 0 0 0-22.244-8.464 14.547 14.547 0 0 0-5.766 6.956L51.464 207.214l-.582 1.455a104.107 104.107 0 0 0 34.544 120.32l.212.16.476.37 85.301 63.93 42.32 31.977 25.71 19.441a17.378 17.378 0 0 0 20.948 0l25.71-19.44 42.32-31.979 85.909-64.3.238-.185a104.107 104.107 0 0 0 34.57-120.294z" fill="#e53935" /><path d="m449.14 208.669-.555-1.482a189.118 189.118 0 0 0-75.383 33.91L250.077 334.2l78.398 59.248 85.91-64.3.238-.185A104.107 104.107 0 0 0 449.14 208.67z" fill="#ef6c00" /><path d="m171.415 393.448 42.32 31.978 25.71 19.441a17.378 17.378 0 0 0 20.948 0l25.71-19.44 42.32-31.979-78.399-59.248z" fill="#f9a825" /><path d="M126.82 241.096a188.959 188.959 0 0 0-75.356-33.882l-.582 1.455a104.107 104.107 0 0 0 34.544 120.32l.212.16.476.37 85.301 63.93 78.45-59.249z" fill="#ef6c00" /></svg>

    </SvgIcon>
  );
}

function DockerIcon(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: `${icon_size}`, height: `${icon_size}` }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.593 10.11c-.065-.043-.605-.464-1.77-.464-.303 0-.606.032-.908.086-.227-1.512-1.49-2.278-1.544-2.31l-.313-.184-.195.291a3.57 3.57 0 0 0-.55 1.285c-.216.864-.087 1.685.356 2.387-.53.302-1.393.378-1.577.378H1.87a.675.675 0 0 0-.67.68c0 1.242.195 2.483.627 3.65.486 1.285 1.22 2.235 2.16 2.818 1.058.648 2.797 1.015 4.773 1.015.853 0 1.738-.075 2.613-.237a10.655 10.655 0 0 0 3.445-1.253 8.962 8.962 0 0 0 2.343-1.933c1.134-1.263 1.803-2.7 2.29-3.941h.204c1.231 0 1.998-.497 2.42-.918.28-.26.485-.572.636-.94l.087-.259-.205-.15M3.199 11.178h1.9a.178.178 0 0 0 .173-.173V9.3a.178.178 0 0 0-.173-.173H3.2a.17.17 0 0 0-.173.173v1.706c.01.098.075.173.173.173m2.624 0h1.9a.178.178 0 0 0 .173-.173V9.3a.178.178 0 0 0-.173-.173h-1.9a.17.17 0 0 0-.173.173v1.706c.01.098.075.173.173.173m2.667 0h1.89c.108 0 .183-.075.183-.173V9.3a.174.174 0 0 0-.183-.173H8.49c-.087 0-.162.076-.162.173v1.706c0 .098.065.173.162.173m2.635 0h1.91a.169.169 0 0 0 .163-.173V9.3c0-.086-.065-.173-.162-.173h-1.911c-.087 0-.162.076-.162.173v1.706c0 .098.075.173.162.173M5.823 8.76h1.9c.087 0 .173-.097.173-.194V6.87a.17.17 0 0 0-.173-.172h-1.9c-.098 0-.173.064-.173.172v1.696c.01.097.075.194.173.194m2.667 0h1.89c.108 0 .183-.097.183-.194V6.87c0-.097-.065-.172-.183-.172H8.49c-.087 0-.162.064-.162.172v1.696c0 .097.065.194.162.194m2.635 0h1.91c.087 0 .163-.097.163-.194V6.87a.168.168 0 0 0-.162-.172h-1.911c-.087 0-.162.064-.162.172v1.696c0 .097.075.194.162.194m0-2.462h1.91a.169.169 0 0 0 .163-.173V4.441c0-.108-.076-.184-.162-.184h-1.911c-.087 0-.162.065-.162.184v1.684c0 .087.075.173.162.173m2.656 4.881h1.9a.17.17 0 0 0 .173-.173V9.3a.178.178 0 0 0-.172-.173H13.78c-.086 0-.162.076-.162.173v1.706c0 .097.076.173.162.173" fill="#0087c9" /></svg>

    </SvgIcon>
  );
}
export const TypeIcon: React.FC<Props> = (props) => {
  if (props.droppable) {
    return;
  }

  switch (props.fileType) {
    case "cpp":
      return <CppIcon />;
    case "hpp":
      return <HppIcon />;
    case "python":
      return <PythonIcon />;
    case "json":
      return <JSONIcon />;
    case "yml":
      return <YAMLIcon />;
    case "git":
      return <GitIcon />;
    case "markdown":
      return <MarkDownIcon />;
    case "cmake":
      return <CMakeIcon />;
    case "gitlab":
      return <GitLabIcon />;
    case "docker":
      return <DockerIcon />;
    default:
      return <InsertDriveFileOutlinedIcon />;
  }
};
