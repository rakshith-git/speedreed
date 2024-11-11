import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Paperclip, Image, Cpu, Clipboard } from "lucide-react";
import { BorderBeam } from "../ui/border-beam";

export default function TextArea() {
  return (
    <div className="w-full space-y-4 p-4 bg-background text-foreground">
      <div className="flex items-center space-x-2">
        <div className="flex-grow flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button variant="outline" size="icon">
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach</span>
          </Button>
          <Button variant="outline" size="icon">
            <Image className="h-4 w-4 text-white" />
            <span className="sr-only">Image</span>
          </Button>
          <Button variant="outline" size="icon">
            <Cpu className="h-4 w-4" />
            <span className="sr-only">AI</span>
          </Button>
          <Button variant="outline" size="icon">
            <Clipboard className="h-4 w-4" />
            <span className="sr-only">Clipboard</span>
          </Button>
        </div>
      </div>
      <div className="relative">
        <BorderBeam duration={10} />
        <BorderBeam duration={10} delay={5} />
        <Textarea
          placeholder="Type your content here..."
          className="min-h-[400px] w-full"
        />
      </div>
    </div>
  );
}
