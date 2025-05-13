// src/components/LocationPicker.tsx
import { View, Picker, Text, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { provinces } from '../constants/location';
import locationIcon from '../icons/pin_drop.png'

interface LocationPickerProps {
  value?: { province: string; city: string }
  onChange?: (location: { province: string; city: string }) => void
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [selectedProvince, setSelectedProvince] = useState(value?.province || '')
  const [selectedCity, setSelectedCity] = useState(value?.city || '')

  // 监听 value 的变化并同步状态
  useEffect(() => {
    if (value) {
      setSelectedProvince(value.province || '')
      setSelectedCity(value.city || '')
    }
  }, [value])

  const handleProvinceChange = (e) => {
    const province = provinces[e.detail.value].name
    setSelectedProvince(province)
    const firstCity = provinces[e.detail.value].cities[0]
    setSelectedCity(firstCity)
    onChange?.({ province, city: firstCity })
  }

  const handleCityChange = (e) => {
    const province = selectedProvince
    const city = provinces.find(p => p.name === province)?.cities[e.detail.value] || ''
    setSelectedCity(city)
    onChange?.({ province, city })
  }

  const getCities = () => {
    return provinces.find(p => p.name === selectedProvince)?.cities || []
  }

  return (
    <View className='bg-white rounded-lg p-5 shadow-sm border border-gray-100'>
      <View className='flex items-center mb-5'>
        <Image src={locationIcon} className='w-6 h-6 mr-2' />
        <Text className='text-gray-800 font-medium text-lg'>选择位置</Text>
      </View>

      <View className='flex flex-col space-y-4'>
        <View className='flex items-center'>
          <Text className='text-gray-600 w-20'>省份</Text>
          <Picker
            mode='selector'
            range={provinces.map(p => p.name)}
            onChange={handleProvinceChange}
            className='flex-1'
          >
            <View className='bg-gray-50 p-3 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors'>
              <Text className={`${selectedProvince ? 'text-gray-800' : 'text-gray-400'}`}>
                {selectedProvince || '请选择省份'}
              </Text>
              <View className='text-gray-400'>
                <Text className='transform rotate-90 inline-block'>›</Text>
              </View>
            </View>
          </Picker>
        </View>

        <View className='flex items-center'>
          <Text className='text-gray-600 w-20'>城市</Text>
          <Picker
            mode='selector'
            range={getCities()}
            onChange={handleCityChange}
            className='flex-1'
          >
            <View className='bg-gray-50 p-3 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors'>
              <Text className={`${selectedCity ? 'text-gray-800' : 'text-gray-400'}`}>
                {selectedCity || '请选择城市'}
              </Text>
              <View className='text-gray-400'>
                <Text className='transform rotate-90 inline-block'>›</Text>
              </View>
            </View>
          </Picker>
        </View>
      </View>

      {selectedProvince && selectedCity && (
        <View className='mt-5 pt-4 border-t border-gray-100'>
          <View className='flex items-center'>
            <Image src={locationIcon} className='w-4 h-4 mr-2 opacity-60' />
            <Text className='text-sm text-gray-600'>当前位置：{selectedProvince} {selectedCity}</Text>
          </View>
        </View>
      )}
    </View>
  )
}
