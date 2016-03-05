import mechanize
import cookielib
import urllib
import urlparse
# Browser
visited = [url]


br = mechanize.Browser()

#url to start on and TLD to follow
#this website has nothing to do with me, just a small website I found as an example#
url="http://www.dustyfeet.com/"
domain="http://www.dustyfeet.com/"

# Cookie Jar for holding cookies
cj = cookielib.LWPCookieJar()
br.set_cookiejar(cj)
# Browser options
br.set_handle_equiv(True)
br.set_handle_gzip(False)
br.set_handle_redirect(True)
br.set_handle_referer(True)
br.set_handle_robots(False)

br.set_handle_refresh(mechanize._http.HTTPRefreshProcessor(), max_time=1)

# Want debugging messages?
br.set_debug_http(False)
br.set_debug_redirects(False)
br.set_debug_responses(False)
#change useragent and play back cookie to fool some anti spider methods
br.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1'),('Cookie', "cookie=INSERT COOKIE FROM DEVTOOLS HERE")]

# create lists for the urls in queue and visited urls
urls = [url]
# Since the amount of urls in the list is dynamic
#   we just let the spider go until A url doesnt
#   have new ones on the webpage
br.open(urls[0])
print br.response().read()
htmltext=br.response().read()

while len(urls)>0:
    try:
        br.open(urls[0])
        urls.pop(0)
        for link in br.links():
            newurl =  urlparse.urljoin(link.base_url,link.url)
            javascript = "javascript:Getabsurl('"
            symbols = "');"
            #detect and replace text with proper TLD
            if javascript in newurl:
                newurl = newurl.replace(javascript, "http://www.dustyfeet.com")
            if symbols in newurl:
                newurl = newurl.replace(symbols, "") 
            if newurl not in visited and domain in newurl:
                visited.append(newurl)
                urls.append(newurl)
                print newurl
                f = open('sp.txt', 'a')
                f.write(newurl+"\n")
    except:
        print "No new links found"
        print len(urls)
        urls.pop(0)
        
print visited
print len(visited)
