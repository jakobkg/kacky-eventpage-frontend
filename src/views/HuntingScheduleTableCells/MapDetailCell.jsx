import React, { memo, useContext } from 'react';
import {
  Text,
  Flex,
  Center,
  Spacer,
  useDisclosure,
  Box,
  Tooltip,
} from '@chakra-ui/react';
import PropTypes, { bool, number, string } from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { getMapImageUrl } from '../../api/api';
import MapDiscordCell from './MapDiscordCell';
import { MapDifficultyCell } from './MapDifficultyCell';
import MapClipCell from './MapClipCell';
import MapImageModal from '../../components/MapImageModal';
import mapImageFallback from '../../assets/images/mapImageFallback.jpg';
import AuthContext from '../../context/AuthContext';
import MapWRCell from './MapWRCell';
import MapPBCell from './MapPBCell';

const MapDetailCell = memo(
  ({ data, mode, eventtype, edition, table, rowIndex }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const getFallbackImage = ev => {
      // eslint-disable-next-line no-param-reassign
      ev.target.src = mapImageFallback;
    };

    const { authentication } = useContext(AuthContext);

    return (
      <Flex margin={3}>
        <Center
          display={{ base: 'none', xl: 'initial' }}
          position="relative"
          w="427px"
          marginRight={10}
        >
          <LazyLoadImage
            w="427px"
            alt="Map"
            onError={getFallbackImage}
            placeholderSrc={getFallbackImage}
            src={getMapImageUrl(eventtype, data.number)}
            onClick={onOpen}
          />
          <MapImageModal
            mapNumber={data.number}
            author={data.author}
            isFinished={data.finished}
            isOpen={isOpen}
            onClose={onClose}
            eventtype={eventtype}
          />
        </Center>
        <Flex
          direction="column"
          justifyContent="space-around"
          alignContent="center"
        >
          <Flex alignContent="center" height="40px" align="center">
            <Text
              width="200px"
              textShadow="glow"
              letterSpacing="0.2em"
              fontSize="lg"
              fontWeight="400"
            >
              Author:
            </Text>
            <Text>{data.author}</Text>
          </Flex>
          <Flex alignContent="center" height="40px" align="center">
            <MapWRCell wrScore={data.wrScore} wrHolder={data.wrHolder} />
          </Flex>
          {mode === 'minimal' ? null : (
            <Flex height="40px" align="center">
              <MapPBCell
                personalBest={data.personalBest}
                wrHolder={data.wrHolder}
                kackyRank={data.kackyRank}
              />
            </Flex>
          )}
        </Flex>
        <Spacer />
        {authentication.isLoggedIn && mode !== 'minimal' ? (
          <Flex
            marginLeft="20"
            direction="column"
            justifyContent="space-around"
          >
            <Flex alignContent="center" height="40px" align="center">
              <Tooltip
                label={`Rated Difficulty: ${data.rating}`}
                placement="start"
              >
                <Text
                  width="200px"
                  textShadow="glow"
                  letterSpacing="0.2em"
                  fontSize="lg"
                  fontWeight="400"
                >
                  Difficulty:
                </Text>
              </Tooltip>
              <MapDifficultyCell
                difficulty={data.difficulty}
                mapId={data.number}
                eventtype={eventtype}
                edition={edition}
                table={table}
                rowIndex={rowIndex}
              />
            </Flex>
            <Flex height="40px" align="center">
              <Text
                width="200px"
                textShadow="glow"
                letterSpacing="0.2em"
                fontSize="lg"
                fontWeight="400"
              >
                Clip:
              </Text>
              <MapClipCell
                clip={data.clip}
                mapId={data.number}
                eventtype={eventtype}
                edition={edition}
                rowIndex={rowIndex}
                table={table}
              />
            </Flex>
            <Flex alignContent="center" height="40px" align="center">
              <Box display={mode === 'hunting' ? 'none' : 'inherit'}>
                <Text
                  width="200px"
                  textShadow="glow"
                  letterSpacing="0.2em"
                  fontSize="lg"
                  fontWeight="400"
                >
                  Discord Alarm:
                </Text>
                <MapDiscordCell
                  discordPing={data.discordPing}
                  eventtype={eventtype}
                  edition={edition}
                  table={table}
                  rowIndex={rowIndex}
                  mapId={data.number}
                />
              </Box>
            </Flex>
          </Flex>
        ) : mode === 'minimal' ? null : (
          <Flex
            marginLeft="20"
            direction="column"
            justifyContent="space-around"
          >
            <Flex alignContent="center" height="40px" align="center">
              <Tooltip
                label={`Rated Difficulty: ${data.rating}`}
                placement="start"
              >
                <Text
                  width="200px"
                  textShadow="glow"
                  letterSpacing="0.2em"
                  fontSize="lg"
                  fontWeight="400"
                >
                  Difficulty:
                </Text>
              </Tooltip>
              <MapDifficultyCell
                difficulty={data.difficulty}
                mapId={data.number}
                eventtype={eventtype}
                edition={edition}
                table={table}
                rowIndex={rowIndex}
              />
            </Flex>
          </Flex>
        )}
      </Flex>
    );
  }
);

MapDetailCell.propTypes = {
  data: PropTypes.shape({
    finished: bool.isRequired,
    number: string.isRequired,
    version: string.isRequired,
    author: string.isRequired,
    difficulty: number.isRequired,
    rating: number.isRequired,
    personalBest: number.isRequired,
    kackyRank: number.isRequired,
    clip: string.isRequired,
    discordPing: bool.isRequired,
    wrScore: number.isRequired,
    wrHolder: string.isRequired,
  }).isRequired,
  eventtype: string.isRequired,
  edition: number.isRequired,
  mode: string.isRequired,
  table: PropTypes.instanceOf(Object),
  rowIndex: number,
};

MapDetailCell.defaultProps = {
  table: undefined,
  rowIndex: undefined,
};

export default MapDetailCell;
