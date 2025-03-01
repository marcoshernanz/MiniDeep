import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from './ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <View className="flex flex-row gap-2 p-4">
      <Pressable 
        className={`px-4 py-2 rounded-md ${theme === 'light' ? 'bg-blue-500' : 'bg-gray-300'}`}
        onPress={() => setTheme('light')}
      >
        <Text className={`${theme === 'light' ? 'text-white' : 'text-black'}`}>Light</Text>
      </Pressable>
      
      <Pressable 
        className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-blue-500' : 'bg-gray-300'}`}
        onPress={() => setTheme('dark')}
      >
        <Text className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>Dark</Text>
      </Pressable>
      
      <Pressable 
        className={`px-4 py-2 rounded-md ${theme === 'system' ? 'bg-blue-500' : 'bg-gray-300'}`}
        onPress={() => setTheme('system')}
      >
        <Text className={`${theme === 'system' ? 'text-white' : 'text-black'}`}>System</Text>
      </Pressable>
    </View>
  );
};
