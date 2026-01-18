package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"
)

const userAgent = "web:reddit-web-client:v0.1 (by /u/username)"

var client = &http.Client{Timeout: 5 * time.Second}

type Listing struct {
	Data ListingData `json:"data"`
}

type ListingData struct {
	After    string `json:"after"`
	Children []Post `json:"children"`
}

type Post struct {
	Data PostData `json:"data"`
}

type PostData struct {
	Title    string `json:"title"`
	Downs    int    `json:"downs"`
	Ups      int    `json:"ups"`
	Url      string `json:"url"`
	PostHint string `json:"post_hint"`
	Media    *Media `json:"media"`
	IsVideo  bool   `json:"is_video"`
}

type Media struct {
	RedditVideo *RedditVideo `json:"reddit_video"`
}

type RedditVideo struct {
	FallbackUrl string `json:"fallback_url"`
}

type ListingConfig struct {
	Name   string
	Limit  string
	Time   string
	SortBy string
}

func NewListingConfig(r *http.Request) *ListingConfig {
	params := r.URL.Query()

	name := r.PathValue("name")

	limit := params.Get("limit")
	if limit == "" {
		limit = "30"
	}

	time := params.Get("t")
	sortBy := params.Get("sort_by")
	if sortBy == "" {
		sortBy = "best"
	}

	return &ListingConfig{
		Name:   name,
		Limit:  limit,
		Time:   time,
		SortBy: sortBy,
	}
}

func viewSubreddit(w http.ResponseWriter, r *http.Request) {
	config := NewListingConfig(r)
	url := fmt.Sprintf("https://www.reddit.com/r/%v/%v.json?limit=%v", config.Name, config.SortBy, config.Limit)
	if config.Time != "" {
		url += fmt.Sprintf("&t=%v", config.Time)
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatalln(err)
	}

	req.Header.Set("User-Agent", userAgent)

	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()

	var listing Listing
	if err := json.NewDecoder(resp.Body).Decode(&listing); err != nil {
		log.Fatalln(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if err := json.NewEncoder(w).Encode(listing.Data); err != nil {
		log.Fatalln(err)
	}
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "templates/index.html")
}

func main() {
	port := flag.String("port", "8080", "port to listen on")
	flag.Parse()
	addr := fmt.Sprintf("localhost:%v", *port)

	http.HandleFunc("GET /", indexHandler)
	http.HandleFunc("GET /r/{name}", viewSubreddit)
	http.Handle("GET /assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("assets"))))

	log.Printf("Server was started. Open %v in your browser\n", addr)
	log.Fatalln(http.ListenAndServe(addr, nil))
}
