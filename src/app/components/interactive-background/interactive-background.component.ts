import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';

interface BlobState {
  depth: number;
  x: number;
  y: number;
  phase: number;
}

@Component({
  selector: 'app-interactive-bg',
  templateUrl: './interactive-background.component.html',
  styleUrls: ['./interactive-background.component.scss'],
})
export class InteractiveBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('blob') blobEls!: QueryList<ElementRef<HTMLDivElement>>;

  private targetX = 0;
  private targetY = 0;
  private rafId: number | null = null;
  private startTime = performance.now();
  private reducedMotion = false;
  private states: BlobState[] = [
    { depth: 18, x: 0, y: 0, phase: 0 },
    { depth: 28, x: 0, y: 0, phase: 2.1 },
    { depth: 12, x: 0, y: 0, phase: 4.2 },
  ];

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!this.reducedMotion) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.reducedMotion) return;
    this.targetX = event.clientX / window.innerWidth - 0.5;
    this.targetY = event.clientY / window.innerHeight - 0.5;
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.reducedMotion || !event.touches.length) return;
    const touch = event.touches[0];
    this.targetX = touch.clientX / window.innerWidth - 0.5;
    this.targetY = touch.clientY / window.innerHeight - 0.5;
  }

  private tick = (now: number) => {
    const elapsed = (now - this.startTime) / 1000;
    const els = this.blobEls.toArray();

    this.states.forEach((state, i) => {
      state.x += (this.targetX - state.x) * 0.04;
      state.y += (this.targetY - state.y) * 0.04;

      const driftX = Math.sin(elapsed * 0.18 + state.phase) * 22;
      const driftY = Math.cos(elapsed * 0.15 + state.phase) * 22;

      const px = state.x * state.depth + driftX;
      const py = state.y * state.depth + driftY;

      const el = els[i]?.nativeElement;
      if (el) {
        el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
      }
    });

    this.rafId = requestAnimationFrame(this.tick);
  };
}
