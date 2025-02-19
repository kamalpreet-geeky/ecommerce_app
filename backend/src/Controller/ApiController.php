<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class ApiController extends AbstractController
{
    #[Route('/api/product', name: 'app_api', methods: ['GET'])]
    public function getProducts(ProductRepository $productRepository , Request $request): JsonResponse
    {
        $products = $productRepository->findAll();
        $baseUrl = $request->getSchemeAndHttpHost(); // Gets "http://127.0.0.1:8000"

        $data = array_map(fn($product) => [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'price' => $product->getPrice(),
            'description' => $product->getDescription(),
            'image' => $baseUrl . '/uploads/' . $product->getImage(),
        ], $products);

        return $this->json($data, 200, ['Access-Control-Allow-Origin' => '*']);
    }
}
