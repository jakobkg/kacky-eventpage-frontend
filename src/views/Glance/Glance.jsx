import {
  Button,
  Center,
  useBoolean,
  VStack,
  useColorMode,
  Text,
  Box,
  HStack,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  Input,
  Popover,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import React, { useEffect, useState, useContext } from 'react';
import {
  MdGridView,
  MdInvertColors,
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdOutlineModeEdit,
  MdOutlineViewHeadline,
} from 'react-icons/md';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ChromePicker } from 'react-color';
// eslint-disable-next-line no-unused-vars
import { getDashboardData, getStreamInfo } from '../../api/api';

import AuthContext from '../../context/AuthContext';
import { getDefaultBackgrounds } from '../../components/Header/Theming/BackgroundColors';
import VerticalGlanceLayout from './Layouts/VerticalGlanceLayout';
import HorizontalGlanceLayout from './Layouts/HorizontalGlanceLayout';
import HorizontalMinimalGlanceLayout from './Layouts/HorizontalMinimalGlanceLayout';

const mapChangeEstimate = 20;

const Glance = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [viewType, setViewType] = useState(
    localStorage.getItem('glanceLayout') || 'vertical'
  );
  const [bgColor, setBgColor] = useState(
    localStorage.getItem('glanceBG') || 'theme'
  );
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [isInvalidColor, setIsInvalidColor] = useBoolean(false);

  const [servers, setServers] = useState([]);
  const [counter, setCounter] = useState([0]);

  const [sliderValue, setSliderValue] = useState(
    localStorage.getItem('glanceSpacing') || 2
  );

  const { authentication } = useContext(AuthContext);
  const { data, isSuccess } = useQuery(
    ['servers', authentication.token],
    () => getDashboardData(authentication.token),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      const timeLeftArr = [];
      const formattedData = [];
      data.servers.forEach(server => {
        timeLeftArr.push(server.timeLeft + mapChangeEstimate);
        const formattedServer = {
          serverNumber: server.serverNumber.toString(),
          maps: server.maps,
          serverDifficulty: server.serverDifficulty,
          timeLimit: server.timeLimit * 60,
        };
        formattedData.push(formattedServer);
      });
      setServers(formattedData);
      setCounter(timeLeftArr);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    const counterCopy = [...counter];
    const timer = setInterval(() => {
      counter.forEach((element, index) => {
        if (counterCopy[index] > 0) counterCopy[index] -= 1;
        if (counterCopy[index] === 0)
          queryClient.invalidateQueries(['servers']);
        if (counter.length - 1 === index) setCounter(counterCopy);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [counter, queryClient]);

  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState('');

  /* useEffect(() => {
    const interval = setInterval(() => {
      getStreamInfo(authentication.token).then(json => setMessage(json.data));
    }, 2000);
    return () => clearInterval(interval);
   }, [authentication.token]); */

  useEffect(() => {
    if (bgColor === 'theme') {
      const gradient =
        colorMode === 'dark'
          ? getDefaultBackgrounds().dark
          : getDefaultBackgrounds().light;
      document.body.style.background = '';
      document.body.style.backgroundImage = `linear-gradient(${gradient[0]},${gradient[1]});`;
      localStorage.setItem('glanceBG', 'theme');
      return;
    }
    if (!(/^#[0-9A-F]{6}$/i.test(bgColor) || /^[0-9A-F]{6}$/i.test(bgColor))) {
      setIsInvalidColor.on();
      return;
    }
    setIsInvalidColor.off();
    document.body.style.background =
      bgColor[0] === '#' ? bgColor : `#${bgColor}`;
    localStorage.setItem('glanceBG', bgColor);
  }, [bgColor, setIsInvalidColor, colorMode]);

  return (
    <>
      <VStack spacing="4" mb={6}>
        <HStack spacing="0" as={Center}>
          <Button
            borderRadius="6px 0 0 6px"
            onClick={() => setViewType('vertical')}
            leftIcon={<MdOutlineViewHeadline />}
            borderColor={
              viewType === 'vertical'
                ? colorMode === 'dark'
                  ? 'white'
                  : 'black'
                : 'transparent'
            }
            borderWidth="1px"
            pointerEvents={viewType === 'vertical' ? 'none' : 'auto'}
            shadow={viewType === 'vertical' ? 'glow' : 'none'}
            textShadow={viewType === 'vertical' ? 'glow' : 'none'}
            minW="8%"
          >
            Vertical
          </Button>
          <Button
            borderRadius="00"
            onClick={() => setViewType('horizontal')}
            leftIcon={<MdGridView />}
            borderColor={
              viewType === 'horizontal'
                ? colorMode === 'dark'
                  ? 'white'
                  : 'black'
                : 'transparent'
            }
            borderWidth="1px"
            pointerEvents={viewType === 'horizontal' ? 'none' : 'auto'}
            shadow={viewType === 'horizontal' ? 'glow' : 'none'}
            textShadow={viewType === 'horizontal' ? 'glow' : 'none'}
            minW="8%"
          >
            Horizontal
          </Button>
          <Button
            borderRadius="00"
            onClick={() => setViewType('vertical-minimal')}
            leftIcon={<MdGridView />}
            borderColor={
              viewType === 'vertical-minimal'
                ? colorMode === 'dark'
                  ? 'white'
                  : 'black'
                : 'transparent'
            }
            borderWidth="1px"
            pointerEvents={viewType === 'vertical-minimal' ? 'none' : 'auto'}
            shadow={viewType === 'vertical-minimal' ? 'glow' : 'none'}
            textShadow={viewType === 'vertical-minimal' ? 'glow' : 'none'}
            minW="8%"
          >
            Vertical Minimal
          </Button>
          <Button
            borderRadius="0 6px 6px 0"
            onClick={() => setViewType('horizontal-minimal')}
            leftIcon={<MdGridView />}
            borderColor={
              viewType === 'horizontal-minimal'
                ? colorMode === 'dark'
                  ? 'white'
                  : 'black'
                : 'transparent'
            }
            borderWidth="1px"
            pointerEvents={viewType === 'horizontal-minimal' ? 'none' : 'auto'}
            shadow={viewType === 'horizontal-minimal' ? 'glow' : 'none'}
            textShadow={viewType === 'horizontal-minimal' ? 'glow' : 'none'}
            minW="8%"
          >
            Horizontal Minimal
          </Button>
        </HStack>
        <HStack mb={8} spacing="0" as={Center}>
          <Button
            alignSelf="start"
            borderRadius="6px 0 0 6px"
            onClick={() => setBgColor('theme')}
            leftIcon={
              colorMode === 'dark' ? (
                <MdOutlineDarkMode />
              ) : (
                <MdOutlineLightMode />
              )
            }
            borderColor={
              bgColor === 'theme'
                ? colorMode === 'dark'
                  ? 'white'
                  : 'black'
                : 'transparent'
            }
            borderWidth="1px"
            pointerEvents={bgColor === 'theme' ? 'none' : 'auto'}
            shadow={bgColor === 'theme' ? 'glow' : 'none'}
            textShadow={bgColor === 'theme' ? 'glow' : 'none'}
            minW="8%"
          >
            Theme
          </Button>
          <Button
            borderRadius="0 6px 6px 0"
            onClick={() => setBgColor('#000000')}
            rightIcon={<MdGridView />}
            borderColor={
              bgColor !== 'theme'
                ? colorMode === 'dark'
                  ? 'white'
                  : 'black'
                : 'transparent'
            }
            borderWidth="1px"
            pointerEvents={bgColor !== 'theme' ? 'none' : 'auto'}
            shadow={bgColor !== 'theme' ? 'glow' : 'none'}
            textShadow={bgColor !== 'theme' ? 'glow' : 'none'}
            minW="8%"
          >
            Custom
          </Button>
        </HStack>
        {bgColor !== 'theme' ? (
          <HStack>
            <Input
              onChange={e => setBgColor(e.target.value)}
              textColor={
                isInvalidColor
                  ? 'red'
                  : colorMode === 'dark'
                  ? 'white'
                  : 'black'
              }
              placeholder="hex color"
            />
            <IconButton
              onClick={toggleColorMode}
              icon={<MdInvertColors fontSize="24px" />}
              aria-label="Toggles the page's color mode to change text color."
            />
            <Popover
              placement="right"
              onOpen={onOpen}
              onClose={onClose}
              isOpen={isOpen}
            >
              <PopoverTrigger>
                <IconButton
                  onClick={onOpen}
                  icon={<MdOutlineModeEdit fontSize="24px" />}
                  aria-label="Select a custom background color."
                />
              </PopoverTrigger>
              <PopoverContent>
                <ChromePicker
                  color={bgColor !== 'theme' ? bgColor : '#000000'}
                  onChange={e => setBgColor(e.hex)}
                />
              </PopoverContent>
            </Popover>
          </HStack>
        ) : null}
        <HStack>
          <Text>Spacing:</Text>
          <Box width={200}>
            <Slider
              aria-label="spacing-slider"
              colorScheme="gray"
              min={0}
              max={10}
              defaultValue={sliderValue}
              onChange={val => setSliderValue(val)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        </HStack>
      </VStack>
      {message === '' ? (
        <>
          {viewType === 'vertical' && (
            <VerticalGlanceLayout
              servers={servers}
              counter={counter}
              mapChangeEstimate={mapChangeEstimate}
              elemSpacing={sliderValue}
            />
          )}
          {viewType === 'horizontal' && (
            <HorizontalGlanceLayout
              servers={servers}
              counter={counter}
              mapChangeEstimate={mapChangeEstimate}
              elemSpacing={sliderValue}
            />
          )}
          {viewType === 'horizontal-minimal' && (
            <HorizontalMinimalGlanceLayout
              servers={servers}
              counter={counter}
              mapChangeEstimate={mapChangeEstimate}
              elemSpacing={sliderValue}
            />
          )}
        </>
      ) : (
        <Center>
          <Box
            w="200px"
            h="500px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="2xl" letterSpacing="wide" lineHeight="1.5">
              {message}
            </Text>
          </Box>
        </Center>
      )}
    </>
  );
};

export default Glance;
