'use client';

import { useRef, useState, useTransition } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

import { DottedSeparator } from './DottedSeparator';
import { Image, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';
import { useUser } from '@clerk/nextjs';
import { groupedCountries } from '@/lib/countries';

import { Hint } from './Hint';
import { createPost } from '@/lib/actions/createPost';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function PostForm() {
  const { user } = useUser();

  const [isPending, startTransition] = useTransition();
  const [post, setPost] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const imageRef = useRef<HTMLInputElement>(null);

  const allRegions = groupedCountries;
  const countryOptions = allRegions.find((r) => r.label === region)?.options;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (files.length > 5) {
        toast.error('You can only upload a maximum of 5 images.');
        event.target.value = ''; // Clear the file input
        return;
      }

      const totalSize = Array.from(files).reduce(
        (acc, file) => acc + file.size,
        0
      );
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes

      if (totalSize > maxSize) {
        toast.error(
          'Total file size exceeds 5MB limit. Please select smaller files.'
        );
        event.target.value = ''; // Clear the file input
        return;
      }

      console.log('Selected files:', files);
      Array.from(files).forEach((file, index) => {
        console.log(`File ${index + 1}:`, file.name, file.type, file.size);
      });

      setSelectedImages(Array.from(files));
    }
  };

  const resetCountryOptions = () => {
    setCountry('');
    setRegion('');
  };

  const clearForm = () => {
    setPost('');
    setCountry('');
    setRegion('');
    setSelectedImages([]);
  };

  const btnDisabled = !user || !post || !country || isPending;

  return (
    <Card className="py-2 mb-4">
      <CardContent className="space-y-4">
        <form
          action={async (formData: FormData) => {
            startTransition(async () => {
              selectedImages.forEach((file, index) => {
                formData.append(`image-${index}`, file);
              });
              clearForm();
              const result = await createPost(formData);
              if (result?.success) {
                toast.success(result.message);
              } else {
                toast.error(result.message);
              }
            });
          }}
          className="space-y-4"
        >
          <div className="flex space-x-4">
            <Avatar>
              <AvatarImage src={user?.imageUrl} alt={user?.username || ''} />
              <AvatarFallback>
                {user?.username?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="w-full flex flex-col lg:flex-row lg:items-start">
              <textarea
                name="post"
                value={post}
                onChange={(e) => setPost(e.target.value)}
                className="w-full mt-2 outline-none h-24 resize-none text-sm lg:text-base disabled:cursor-not-allowed bg-transparent"
                placeholder={
                  user
                    ? 'Tell us about your travel experience!'
                    : 'Sign in to share your travel experiences!'
                }
                maxLength={500}
                disabled={!user}
              />
              <div className="text-xs text-muted-foreground text-right">
                <span
                  className={cn(
                    post.length > 399 && 'text-yellow-400',
                    post.length > 449 && 'text-red-400'
                  )}
                >
                  {post.length}
                </span>
                /500 characters
              </div>
            </div>
          </div>
          <DottedSeparator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 max-w-[70%] lg:w-full">
              <div className="flex max-w-[200px]">
                {!region ? (
                  <Select
                    name="region"
                    value={region}
                    onValueChange={(value) => {
                      setCountry('');
                      setRegion(value);
                    }}
                    disabled={!user}
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
                      name="country"
                      value={country}
                      onValueChange={(value) => setCountry(value)}
                      disabled={!user}
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
                        <RefreshCcw
                          onClick={resetCountryOptions}
                          size={14}
                          className="text-white"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Hint description="Add image" side="top" disabled={!user}>
                <Image
                  className={cn(
                    'text-muted-foreground cursor-pointer hover:text-primary-blue',
                    !user && 'cursor-not-allowed hover:text-muted-foreground'
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    imageRef.current?.click();
                  }}
                />
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  ref={imageRef}
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                  max="5"
                  disabled={!user}
                />
              </Hint>
            </div>
            <Button className="font-semibold" disabled={btnDisabled}>
              {isPending ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap gap-4">
          {selectedImages.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Selected image ${index + 1}`}
                className="object-contain w-16 h-16 rounded-lg"
              />
              <button
                onClick={() => {
                  setSelectedImages(
                    selectedImages.filter((_, i) => i !== index)
                  );
                }}
                className="absolute -top-2 -right-2 bg-secondary-blue text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                x
              </button>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          *Post and country are required to create a post
        </p>
      </CardContent>
    </Card>
  );
}
