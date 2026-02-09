import React from 'react'
import { Composition, Folder } from 'remotion'
import { z } from 'zod'
import { GalaxyIntro, galaxyIntroSchema } from './compositions/GalaxyIntro'
import { PlanetShowcase, planetShowcaseSchema } from './compositions/PlanetShowcase'
import { PortfolioTour } from './compositions/PortfolioTour'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Galaxy Portfolio">
        {/* 10-second intro animation */}
        <Composition
          id="GalaxyIntro"
          component={GalaxyIntro}
          schema={galaxyIntroSchema}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'Elizabeth Stein',
            subtitle: 'Full-Stack Developer & AI Specialist',
          }}
        />

        {/* Individual planet showcase - 5 seconds each */}
        <Composition
          id="PlanetShowcase"
          component={PlanetShowcase}
          schema={planetShowcaseSchema}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            projectId: 'coulson-one',
            color: '#FF6B35',
          }}
        />

        {/* Full portfolio tour - 60 seconds */}
        <Composition
          id="PortfolioTour"
          component={PortfolioTour}
          durationInFrames={1800}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* Social Media Formats */}
      <Folder name="Social">
        <Composition
          id="GalaxyIntro-Square"
          component={GalaxyIntro}
          schema={galaxyIntroSchema}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={{
            title: 'Elizabeth Stein',
            subtitle: 'Full-Stack Developer',
          }}
        />

        <Composition
          id="GalaxyIntro-Vertical"
          component={GalaxyIntro}
          schema={galaxyIntroSchema}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            title: 'Elizabeth Stein',
            subtitle: 'Developer Portfolio',
          }}
        />
      </Folder>
    </>
  )
}
