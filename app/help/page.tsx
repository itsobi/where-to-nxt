import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function HelpPage() {
  return (
    <div className="col-span-full">
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-x-2 mb-6">
          <Image src="/logo.svg" alt="Where To NXT?" width={40} height={40} />
          <h2 className="text-2xl font-bold">Contact Us</h2>
        </div>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <Input id="name" name="name" placeholder="John Doe" required />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <Input
              id="subject"
              name="subject"
              placeholder="Brief description of your inquiry"
              required
            />
          </div>
          <div>
            <label
              htmlFor="inquiryType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Inquiry Type
            </label>
            <Select>
              <SelectTrigger id="inquiryType" className="text-base">
                <SelectValue placeholder="Select the type of inquiry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Question</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="billing">Billing Inquiry</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Please provide details about your inquiry"
              className="resize-none"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
