import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

// This component has intentional ESLint errors:
// 1. Unused variable
// 2. Missing dependency in useEffect
// 3. Unnecessary variable
export const EslintTest = () => {
  const [count, setCount] = useState(0);
  const unusedVar = 'this should trigger a warning';
  const testValue = 'Hello World';
  
  useEffect(() => {
    console.log(`The current count is: ${count}`);
    console.log(`Test value is: ${testValue}`);
    
    const timer = setTimeout(() => {
      setCount(count + 1);
    }, 1000);
    
    return () => clearTimeout(timer);
    // Missing dependencies: count and testValue
  }, []);
  
  return (
    <View>
      <Text>Count: {count}</Text>
    </View>
  );
};
