import React from 'react';
import { ProSidebar, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import './home.scss';

export default function Home() {

  return (
    <>
      <ProSidebar>
        <SidebarHeader>
          {/**
           *  You can add a header for the sidebar ex: logo
           */}
           header
        </SidebarHeader>
        <SidebarContent>
          {/**
           *  You can add the content of the sidebar ex: menu, profile details, ...
           */}
           content
        </SidebarContent>
        <SidebarFooter>
          {/**
           *  You can add a footer for the sidebar ex: copyright
           */}
           footer
        </SidebarFooter>
      </ProSidebar>;
    </>
  )
}
