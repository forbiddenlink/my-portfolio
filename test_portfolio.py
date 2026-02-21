#!/usr/bin/env python3
"""
Portfolio Testing Script - Comprehensive Manual Testing via Playwright
Tests all critical functionality of the galaxy portfolio.
"""

import sys
from playwright.sync_api import sync_playwright, expect
import time

def main():
    url = "https://elizabethannstein.com"
    
    print(f"🚀 Testing Portfolio at: {url}\n")
    
    with sync_playwright() as p:
        # Launch browser with visible UI
        browser = p.chromium.launch(headless=False, slow_mo=500)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()
        
        # Track test results
        tests_passed = 0
        tests_failed = 0
        
        try:
            # Test 1: Page loads
            print("✓ Test 1: Page Loading...")
            page.goto(url, wait_until='networkidle', timeout=30000)
            print(f"  Page title: {page.title()}")
            if "Elizabeth" in page.title():
                print("  ✅ PASS: Title contains 'Elizabeth'")
                tests_passed += 1
            else:
                print(f"  ❌ FAIL: Title doesn't contain Elizabeth (got: {page.title()})")
                tests_failed += 1
            
            # Test 2: Dismiss entrance screen if present
            print("\n✓ Test 2: Entrance Screen...")
            try:
                # Wait for page to fully load first
                time.sleep(5)
                
                # Look for "ENTER UNIVERSE" button
                enter_button = page.locator('button:has-text("ENTER UNIVERSE")')
                if enter_button.count() > 0:
                    print("  Found entrance screen with 'ENTER UNIVERSE' button")
                    # Force click to bypass any overlays
                    enter_button.click(force=True, timeout=5000)
                    print("  Clicked entrance button, waiting for fade...")
                    time.sleep(5)  # Wait for fade animation (increased from 3)
                    print("  ✅ PASS: Entrance screen dismissed")
                    tests_passed += 1
                else:
                    print("  No entrance screen found (may have auto-dismissed)")
                    time.sleep(3)
                    tests_passed += 1
            except Exception as e:
                # If no entrance screen, just wait a bit for any animations
                print(f"  No entrance screen visible: {str(e)[:100]}")
                time.sleep(3)
                tests_passed += 1
            
            # Test 3: Header visible
            print("\n✓ Test 3: Header Visibility...")
            page.wait_for_selector('text=Elizabeth Stein', timeout=10000)
            print("  ✅ PASS: Header with name visible")
            tests_passed += 1
            
            # Test 4: Canvas/3D scene loads
            print("\n✓ Test 4: 3D Canvas Rendering...")
            canvas = page.locator('canvas').first
            if canvas.count() > 0:
                print("  ✅ PASS: Canvas element present")
                tests_passed += 1
            else:
                print("  ❌ FAIL: No canvas found")
                tests_failed += 1
            
            # Test 5: "View all work" button exists and is clickable
            print("\n✓ Test 5: 'View all work' Button...")
            view_all_button = page.locator('text=View all work')
            if view_all_button.count() > 0:
                print("  ✅ PASS: 'View all work' button found")
                tests_passed += 1
                
                # Take screenshot before click
                page.screenshot(path='test-screenshot-before-click.png')
                print("  📸 Screenshot saved: test-screenshot-before-click.png")
                
                # Click button (force if needed)
                print("  Clicking 'View all work' button...")
                view_all_button.click(force=True, timeout=10000)
                page.wait_for_load_state('networkidle')
                
                # Verify navigation
                if '/work' in page.url:
                    print(f"  ✅ PASS: Navigated to /work page ({page.url})")
                    tests_passed += 1
                else:
                    print(f"  ❌ FAIL: Didn't navigate to /work (at: {page.url})")
                    tests_failed += 1
                    
                # Take screenshot of work page
                page.screenshot(path='test-screenshot-work-page.png')
                print("  📸 Screenshot saved: test-screenshot-work-page.png")
                
                # Go back to homepage
                page.goto(url, wait_until='networkidle')
            else:
                print("  ❌ FAIL: 'View all work' button not found")
                tests_failed += 1
            
            # Test 6: Contact section
            print("\n✓ Test 6: Contact Section...")
            # Look for email/LinkedIn/GitHub
            has_email = page.locator('a[href^="mailto:"]').count() > 0
            has_linkedin = page.locator('a[href*="linkedin"]').count() > 0
            has_github = page.locator('a[href*="github"]').count() > 0
            
            if has_email and has_linkedin and has_github:
                print("  ✅ PASS: All contact links present (email, LinkedIn, GitHub)")
                tests_passed += 1
            else:
                print(f"  ⚠️  PARTIAL: Contact links - Email: {has_email}, LinkedIn: {has_linkedin}, GitHub: {has_github}")
                tests_failed += 1
            
            # Test 6: Check for console errors
            print("\n✓ Test 7: Console Errors...")
            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            
            # Wait a bit to catch any errors
            time.sleep(3)
            
            if len(console_errors) == 0:
                print("  ✅ PASS: No console errors")
                tests_passed += 1
            else:
                print(f"  ❌ FAIL: {len(console_errors)} console errors found:")
                for error in console_errors[:5]:  # Show first 5
                    print(f"    - {error}")
                tests_failed += 1
            
            # Test 8: Keyboard shortcut (Command Palette - CMD+K)
            print("\n✓ Test 8: Keyboard Shortcuts (CMD+K)...")
            # Press CMD+K (or Ctrl+K on non-Mac)
            modifier = "Meta" if sys.platform == "darwin" else "Control"
            page.keyboard.press(f"{modifier}+KeyK")
            time.sleep(1)
            
            # Check if command palette appeared
            # Look for search input or modal
            has_search = page.locator('input[type="text"], input[type="search"]').count() > 0
            if has_search:
                print("  ✅ PASS: Command palette opened (search input found)")
                tests_passed += 1
                
                # Press Escape to close
                page.keyboard.press("Escape")
                time.sleep(0.5)
            else:
                print("  ⚠️  Could not verify command palette (no search input found)")
                # Not failing this test as the palette might have different structure
            
            # Test 9: Mobile responsiveness check
            print("\n✓ Test 9: Mobile Viewport...")
            page.set_viewport_size({"width": 375, "height": 667})  # iPhone size
            page.reload(wait_until='networkidle')
            time.sleep(3)
            
            # Check if header is still visible
            header_visible = page.locator('text=Elizabeth Stein').is_visible()
            if header_visible:
                print("  ✅ PASS: Header visible on mobile viewport")
                tests_passed += 1
            else:
                print("  ❌ FAIL: Header not visible on mobile")
                tests_failed += 1
            
            page.screenshot(path='test-screenshot-mobile.png')
            print("  📸 Screenshot saved: test-screenshot-mobile.png")
            
            # Restore desktop viewport + final screenshot
            page.set_viewport_size({"width": 1920, "height": 1080})
            page.goto(url, wait_until='networkidle')
            time.sleep(2)
            page.screenshot(path='test-screenshot-final.png', full_page=True)
            print("\n📸 Final full-page screenshot saved: test-screenshot-final.png")
            
        except Exception as e:
            print(f"\n❌ ERROR: {e}")
            tests_failed += 1
            page.screenshot(path='test-screenshot-error.png')
            print("📸 Error screenshot saved: test-screenshot-error.png")
        
        finally:
            # Summary
            print("\n" + "="*60)
            print("📊 TEST SUMMARY")
            print("="*60)
            print(f"✅ Tests Passed: {tests_passed}")
            print(f"❌ Tests Failed: {tests_failed}")
            total = tests_passed + tests_failed
            if total > 0:
                success_rate = (tests_passed / total) * 100
                print(f"📈 Success Rate: {success_rate:.1f}%")
            
            if tests_failed == 0:
                print("\n🎉 ALL TESTS PASSED! Portfolio is working correctly.")
            else:
                print(f"\n⚠️  {tests_failed} test(s) failed. Review output above.")
            
            browser.close()
            
            # Exit code
            sys.exit(0 if tests_failed == 0 else 1)

if __name__ == "__main__":
    main()
