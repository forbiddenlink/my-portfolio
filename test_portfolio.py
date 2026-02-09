#!/usr/bin/env python3
"""Visual verification of the portfolio website."""

from playwright.sync_api import sync_playwright
import time

def test_portfolio():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        print("=" * 60)
        print("PORTFOLIO VISUAL VERIFICATION")
        print("=" * 60)

        # Test 1: Homepage / Galaxy View
        print("\n[1] Testing Homepage (3D Galaxy)...")
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        time.sleep(3)  # Wait for 3D scene and animations

        # Take screenshot
        page.screenshot(path='/tmp/portfolio_home.png', full_page=False)
        print("   ✓ Screenshot saved: /tmp/portfolio_home.png")

        # Check for key elements
        html = page.content()
        checks = [
            ("Elizabeth Stein" in html, "Name heading"),
            ("3d" in html.lower() or "canvas" in html.lower(), "3D Canvas element"),
            ("View all work" in html or "work" in html.lower(), "Work link"),
            ("About" in html, "About link"),
        ]

        for passed, name in checks:
            status = "✓" if passed else "✗"
            print(f"   {status} {name}")

        # Test 2: Work Gallery Page
        print("\n[2] Testing Work Gallery Page...")
        page.goto('http://localhost:3000/work')
        page.wait_for_load_state('networkidle')
        time.sleep(1)

        page.screenshot(path='/tmp/portfolio_work.png', full_page=True)
        print("   ✓ Screenshot saved: /tmp/portfolio_work.png")

        # Count projects
        html = page.content()
        project_links = page.locator('a[href^="/work/"]').count()
        print(f"   ✓ Found {project_links} project links")

        # Check galaxies
        galaxy_names = ["Enterprise", "AI", "Full-Stack", "DevTools", "Design", "Experimental"]
        for galaxy in galaxy_names:
            if galaxy in html:
                print(f"   ✓ Galaxy section: {galaxy}")

        # Test 3: About Page
        print("\n[3] Testing About Page...")
        page.goto('http://localhost:3000/about')
        page.wait_for_load_state('networkidle')
        time.sleep(1)

        page.screenshot(path='/tmp/portfolio_about.png', full_page=True)
        print("   ✓ Screenshot saved: /tmp/portfolio_about.png")

        html = page.content()
        about_checks = [
            ("Hi, I'm Liz" in html, "Greeting heading"),
            ("3.98 GPA" in html, "Education stats"),
            ("1,200" in html, "Test count stat"),
        ]

        for passed, name in about_checks:
            status = "✓" if passed else "✗"
            print(f"   {status} {name}")

        # Test 4: Individual Project Page
        print("\n[4] Testing Individual Project Page...")
        page.goto('http://localhost:3000/work/finance-quest')
        page.wait_for_load_state('networkidle')
        time.sleep(1)

        page.screenshot(path='/tmp/portfolio_project.png', full_page=True)
        print("   ✓ Screenshot saved: /tmp/portfolio_project.png")

        html = page.content()
        project_checks = [
            ("Finance Quest" in html, "Project title"),
            ("702" in html, "Test count metric"),
        ]

        for passed, name in project_checks:
            status = "✓" if passed else "✗"
            print(f"   {status} {name}")

        # Test 5: Mobile View
        print("\n[5] Testing Mobile Responsiveness...")
        page.set_viewport_size({'width': 375, 'height': 812})
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        time.sleep(2)

        page.screenshot(path='/tmp/portfolio_mobile.png', full_page=False)
        print("   ✓ Mobile screenshot saved: /tmp/portfolio_mobile.png")

        # Check console for errors
        print("\n[6] Checking for Console Errors...")
        errors = []
        page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        time.sleep(2)

        if errors:
            print(f"   ✗ Found {len(errors)} console errors")
            for err in errors[:3]:
                print(f"      - {err[:100]}...")
        else:
            print("   ✓ No console errors")

        browser.close()

        print("\n" + "=" * 60)
        print("VERIFICATION COMPLETE")
        print("Screenshots saved to /tmp/portfolio_*.png")
        print("=" * 60)

if __name__ == "__main__":
    test_portfolio()
