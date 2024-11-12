import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Paperclip, Image, Cpu, Clipboard, Dock } from "lucide-react";
import { BorderBeam } from "../ui/border-beam";

export default function TextArea() {
  return (
    <div className="w-full space-y-4 p-4 bg-background text-foreground">
      <div className="flex items-center justify-between">
        {/* Search box and search button container */}
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0 flex items-center space-x-2 max-w-xs">
            <Input type="text" placeholder="Search wiki..." className="w-60" />{" "}
            {/* Set desired width */}
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>

        {/* Right-aligned buttons container */}
        <div className="flex items-center space-x-2">
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
        <BorderBeam duration={30} />
        <Textarea
          placeholder="Type your content here..."
          className="min-h-[300px] w-full"
        />
      </div>
    </div>
  );
}
