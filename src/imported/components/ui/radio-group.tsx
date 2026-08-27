"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

interface RadioGroupContextValue {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  itemCount: number;
  registerItem: () => number;
  handleItemKeyDown: (e: React.KeyboardEvent) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  return React.useContext(RadioGroupContext);
}

interface RadioGroupProps extends React.ComponentProps<typeof RadioGroupPrimitive.Root> {
  onExitBottom?: () => void;
  onExitTop?: () => void;
}

function RadioGroup({
  className,
  children,
  value,
  onValueChange,
  onExitBottom,
  onExitTop,
  ...props
}: RadioGroupProps) {
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const itemCountRef = React.useRef(0);
  const itemValuesRef = React.useRef<string[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Reset item count on each render to track items
  React.useEffect(() => {
    itemCountRef.current = 0;
    itemValuesRef.current = [];
  });

  const registerItem = React.useCallback(() => {
    const index = itemCountRef.current;
    itemCountRef.current += 1;
    return index;
  }, []);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    const items = containerRef.current?.querySelectorAll('[data-slot="radio-group-item"]');
    if (!items || items.length === 0) return;

    const itemCount = items.length;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();

      if (focusedIndex >= itemCount - 1) {
        // At the last item, exit to next section
        onExitBottom?.();
      } else {
        const newIndex = focusedIndex < 0 ? 0 : focusedIndex + 1;
        setFocusedIndex(newIndex);
        (items[newIndex] as HTMLElement)?.focus();
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();

      if (focusedIndex <= 0) {
        // At the first item, exit to previous section
        onExitTop?.();
      } else {
        const newIndex = focusedIndex - 1;
        setFocusedIndex(newIndex);
        (items[newIndex] as HTMLElement)?.focus();
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      // Select the currently focused item
      if (focusedIndex >= 0 && focusedIndex < itemCount) {
        const item = items[focusedIndex] as HTMLElement;
        const itemValue = item.getAttribute("value");
        if (itemValue && onValueChange) {
          onValueChange(itemValue);
        }
      }
    }
  }, [focusedIndex, onValueChange, onExitBottom, onExitTop]);

  const handleFocus = React.useCallback(() => {
    // When the group receives focus, focus the selected item or first item
    const items = containerRef.current?.querySelectorAll('[data-slot="radio-group-item"]');
    if (!items || items.length === 0) return;

    // Find the selected item index
    let selectedIndex = -1;
    items.forEach((item, index) => {
      if (item.getAttribute("data-state") === "checked") {
        selectedIndex = index;
      }
    });

    const indexToFocus = selectedIndex >= 0 ? selectedIndex : 0;
    setFocusedIndex(indexToFocus);
    (items[indexToFocus] as HTMLElement)?.focus();
  }, []);

  const contextValue = React.useMemo(() => ({
    focusedIndex,
    setFocusedIndex,
    itemCount: itemCountRef.current,
    registerItem,
    handleItemKeyDown: handleKeyDown,
  }), [focusedIndex, registerItem, handleKeyDown]);

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <RadioGroupPrimitive.Root
        ref={containerRef}
        data-slot="radio-group"
        className={cn("grid w-full gap-2", className)}
        value={value}
        onValueChange={onValueChange}
        onFocus={handleFocus}
        {...props}
      >
        {children}
      </RadioGroupPrimitive.Root>
    </RadioGroupContext.Provider>
  )
}

interface RadioGroupItemProps extends Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, 'onKeyDown'> {
  index?: number;
}

function RadioGroupItem({
  className,
  ...props
}: RadioGroupItemProps) {
  const context = useRadioGroupContext();
  const indexRef = React.useRef<number>(-1);

  React.useEffect(() => {
    if (context && indexRef.current === -1) {
      indexRef.current = context.registerItem();
    }
  }, [context]);

  const isFocused = context ? context.focusedIndex === indexRef.current : false;

  const handleFocus = React.useCallback(() => {
    if (context && indexRef.current >= 0) {
      context.setFocusedIndex(indexRef.current);
    }
  }, [context]);

  // Prevent default Radix keyboard handling and use parent's handler
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" ||
        e.key === "ArrowLeft" || e.key === "ArrowRight" ||
        e.key === "Enter" || e.key === " ") {
      // Prevent Radix from handling these (it auto-selects on arrows)
      e.preventDefault();
      e.stopPropagation();

      // Use parent's handler from context
      context?.handleItemKeyDown(e);
    }
  }, [context]);

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      data-keyboard-focused={isFocused}
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className
      )}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
