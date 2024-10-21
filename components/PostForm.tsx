'use client';

import { Card, CardContent } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { DottedSeparator } from './DottedSeparator';
import { Image, RefreshCcw, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { useUser } from '@clerk/nextjs';
import { groupedCountries } from '@/lib/countries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useState } from 'react';
import { Hint } from './Hint';

export function PostForm() {
  const { user } = useUser();
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');

  const allRegions = groupedCountries;
  const countryOptions = allRegions.find((r) => r.label === region)?.options;

  const resetCountryOptions = () => {
    setCountry('');
    setRegion('');
  };

  return (
    <Card className="shadow-md p-2">
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt={user?.username || ''} />
            <AvatarFallback>{user?.username?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <textarea
            className="w-full outline-none resize-none"
            placeholder="Share about your journey!"
          />
        </div>
        <DottedSeparator />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 max-w-[70%]">
            <div className="flex max-w-[200px]">
              {!region ? (
                <Select
                  value={region}
                  onValueChange={(value) => {
                    setCountry('');
                    setRegion(value);
                  }}
                >
                  <SelectTrigger className="outline-none ring-0 ring-transparent focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {allRegions.map((region) => (
                      <SelectItem key={region.label} value={region.label}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative">
                  <Select
                    value={country}
                    onValueChange={(value) => setCountry(value)}
                  >
                    <SelectTrigger className="outline-none ring-0 ring-transparent focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Add a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryOptions?.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {region && (
                    <div className="absolute -top-3 -left-2 cursor-pointer bg-secondary-blue rounded-full p-1">
                      <RefreshCcw onClick={resetCountryOptions} size={14} />
                    </div>
                  )}
                </div>
              )}
            </div>

            <Hint description="Add image" side="top">
              <Image className="text-muted-foreground" />
            </Hint>
          </div>
          <Button className="font-semibold">Post</Button>
        </div>
      </CardContent>
    </Card>
  );
}
